import { Box, LinearProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import ToggleButton from './toggleButton';
import { trackedDownload } from './utils/downloadModel';
import ASRHandler from './workerWrappers/asrHandler';
import IDBHandler from './workerWrappers/idbHandler';
import ResampleHandler from './workerWrappers/resamplerHandler';


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


const AudioContext = window.AudioContext || window.webkitAudioContext;

const STATUSES = {
    DOWNLOADING: 'downloading',
    ERROR: 'error',
    LOADING: 'loading',
    RUNNING: 'running',
    STANDBY: 'standby',
    UNINITIALISED: 'UNINITIALISED',
};

const STATUS_MESSAGE = {
    [STATUSES.DOWNLOADING]: 'Downloading model from the web. Please wait',
    [STATUSES.ERROR]: 'Oops something went wrong',
    [STATUSES.LOADING]: 'Starting ASR engine. Please wait',
    [STATUSES.RUNNING]: 'Running',
    [STATUSES.STANDBY]: 'ASR engine ready. Please click on button to start',
    [STATUSES.UNINITIALISED]: '',
};

class ASRPage extends React.Component {
    constructor(props) {
        super(props);

        this.loadModel = this.loadModel.bind(this);
        this.onResampled = this.onResampled.bind(this);
        this.startASR = this.startASR.bind(this);
        this.stopASR = this.stopASR.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.updateTranscription = this.updateTranscription.bind(this);

        this.idbHandler = null;
        this.asrHandler = null;
        this.resamplerHandler = null;
        this.prevIsFinal = false;

        this.state = {
            appStatus: STATUSES.UNINITIALISED,
            transcriptions: [],
            tmpTranscription: '',
            disableRecordButton: true,
            downloadProgress: 100,
            startTime: 0,
            endTime: 0,
        };
    }

    componentDidMount() {
        const { resamplerBufferSize, idbInfo } = this.props;
        this.idbHandler = new IDBHandler();
        this.asrHandler = new ASRHandler();

        this.idbHandler.init(idbInfo).then(() => {
            this.loadModel();
        });

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                const context = new AudioContext();
                const audioSource = context.createMediaStreamSource(stream);
                this.resamplerHandler = new ResampleHandler(audioSource,
                    this.onResampled, resamplerBufferSize);
            })
            .catch(console.log);
    }

    componentWillUnmount() {
        this.idbHandler.terminate();
        this.asrHandler.terminate();
        this.resamplerHandler.terminate();
    }

    loadModel() {
        this.setState({
            appStatus: STATUSES.LOADING,
            disableRecordButton: true,
        });

        const newState = {
            appStatus: STATUSES.ERROR,
            disableRecordButton: false,
        };

        this.idbHandler.get('model')
            .catch(() => this.downloadAndStore('model'))
            .then(({ value: zip }) => new Promise((resolve, reject) => {
                this.asrHandler.terminate()
                    .then(() => { resolve(this.asrHandler.init('model', zip)); })
                    .catch(reject);
            }))
            .then(() => this.asrHandler.getSampleRate())
            .then((asrSR) => this.resamplerHandler.setSampleRate(asrSR))
            .then(() => { newState.appStatus = STATUSES.STANDBY; })
            .catch(console.log)
            .finally(() => this.setState({
                ...newState,
            }));
    }

    onResampled(buffer) {
        this.asrHandler.process(buffer)
            .then(this.updateTranscription);
    }

    updateProgress(value) {
        this.setState({ downloadProgress: value * 100 });
    }

    downloadAndStore(modelName) {
        return new Promise((resolve, reject) => {
            this.setState({ appStatus: STATUSES.DOWNLOADING });
            trackedDownload('api/model', this.updateProgress)
                .then((zip) => {
                    this.idbHandler.add('model', zip)
                        .catch(console.log)
                        .finally(() => {
                            this.setState({ appStatus: STATUSES.LOADING });
                            resolve({ value: zip });
                        });
                })
                .catch(reject);
        });
    }

    updateTranscription(transcription) {
        if (transcription === null) return;
        const { text, isFinal } = transcription;
        // skip streak of isFinal (i.e. repetition of final utterance)
        if (!this.prevIsFinal) {
            // bug: first trancript of new utterance always skipped
            if (isFinal && text !== '') {
                const { transcriptions } = this.state;
                this.setState({
                    transcriptions: transcriptions.concat([text]),
                    tmpTranscription: '',
                });
            } else {
                this.setState({ tmpTranscription: text });
            }
        }
        this.prevIsFinal = isFinal;
    }

    startASR() {
        this.setState({ disableRecordButton: true });

        this.resamplerHandler.start();
        this.setState({
            appStatus: STATUSES.RUNNING,
            disableRecordButton: false,
            startTime: Date.now(),
        });
    }

    stopASR() {
        this.setState({ disableRecordButton: true, endTime: Date.now() });

        const newState = {
            disableRecordButton: true,
            appStatus: STATUSES.ERROR,
        };

        this.resamplerHandler.stop()
            .then(() => this.asrHandler.reset())
            .then(this.updateTranscription)
            .then(() => {
                newState.appStatus = STATUSES.STANDBY;
                newState.disableRecordButton = false;
            })
            .catch(console.log)
            .finally(() => this.setState({
                ...newState,
            }));
    }

    render() {
        const {
            transcriptions,
            tmpTranscription,
            appStatus,
            disableRecordButton,
            downloadProgress,
            startTime,
            endTime,
        } = this.state;

        const statusMessage = STATUS_MESSAGE[appStatus];
        const text = transcriptions.concat(tmpTranscription).join('\n');

        const round2dp = (x) => Math.round((x + Number.EPSILON) * 100) / 100;

        const now = Date.now();
        const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
        const timeElapsed = ((appStatus === STATUSES.RUNNING ? now : endTime)
            - startTime) / 1000;
        const speakingRate = timeElapsed === 0 ? 0 : wordCount / timeElapsed;

        return (
            <div>
                <div>
                    <div>
                        <div>
                            <ToggleButton
                                onStart={this.startASR}
                                onStop={this.stopASR}
                                disabled={disableRecordButton}
                            />
                        </div>
                        <div>
                            <p>
                                {statusMessage}
                            </p>

                            {downloadProgress < 100 && (
                                <LinearProgressWithLabel
                                    value={downloadProgress}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        {text}
                    </div>
                    <div>
                        <br />
                        Words count:&nbsp;
                        <span><strong>{wordCount}</strong></span>
                        <br />
                        Speaking rate (words/second):&nbsp;
                        <span><strong>{round2dp(speakingRate)}</strong></span>
                        <br />
                        Speaking rate (words/minute):&nbsp;
                        <span><strong>{round2dp(60 * speakingRate)}</strong></span>
                        <br />
                        Time elapsed (seconds):&nbsp;
                        <span><strong>{timeElapsed}</strong></span>
                    </div>
                </div>
            </div>
        );
    }
}

ASRPage.defaultProps = {
    resamplerBufferSize: 4096, // ~ 90 ms at 44.1kHz
    idbInfo: {
        name: 'asr_models',
        version: 1,
        storeInfo: {
            name: 'models',
            keyPath: 'language',
        },
    },
};

ASRPage.propTypes = {
    resamplerBufferSize: PropTypes.number,
    idbInfo: PropTypes.shape({
        name: PropTypes.string,
        version: PropTypes.number,
        storeInfo: PropTypes.shape({
            name: PropTypes.string,
            keyPath: PropTypes.string,
        }),
    }),
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ASRPage;
