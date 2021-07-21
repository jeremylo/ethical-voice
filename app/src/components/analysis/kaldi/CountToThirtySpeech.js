import { Box, Button, CircularProgress, LinearProgress, Typography, withStyles } from '@material-ui/core';
import { Mic, Stop } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from 'react';
import { trackedDownload } from './utils/downloadModel';
import ASRHandler from './workerWrappers/asrHandler';
import IDBHandler from './workerWrappers/idbHandler';
import ResampleHandler from './workerWrappers/resamplerHandler';


const myStyles = (theme) => ({
    statusBox: {
        marginTop: '1rem',
        marginBottom: '1rem',
    }
});


const AudioContext = window.AudioContext || window.webkitAudioContext;

const STATUSES = {
    DOWNLOADING: 'downloading',
    ERROR: 'error',
    LOADING: 'loading',
    RUNNING: 'running',
    STANDBY: 'standby',
    UNINITIALISED: 'uninitialised',
};

class CountToThirtySpeech extends React.Component {
    constructor(props) {
        super(props);

        this.loadModel = this.loadModel.bind(this);
        this.onResampled = this.onResampled.bind(this);
        this.startASR = this.startASR.bind(this);
        this.stopASR = this.stopASR.bind(this);
        this.updateDownloadProgress = this.updateDownloadProgress.bind(this);
        this.updateTranscription = this.updateTranscription.bind(this);

        this.idbHandler = null;
        this.asrHandler = null;
        this.resamplerHandler = null;
        this.prevIsFinal = false;

        this.state = {
            appStatus: STATUSES.UNINITIALISED,
            transcriptions: [],
            tmpTranscription: '',
            isRecordButtonDisabled: true,
            downloadProgress: 0,
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
        if (this.idbHandler) this.idbHandler.terminate();
        if (this.asrHandler) this.asrHandler.terminate();
        if (this.resamplerHandler) this.resamplerHandler.terminate();
    }

    loadModel() {
        this.setState({
            appStatus: STATUSES.LOADING,
            isRecordButtonDisabled: true,
        });

        const newState = {
            appStatus: STATUSES.ERROR,
            isRecordButtonDisabled: false,
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
            .finally(() => this.setState(newState));
    }

    onResampled(buffer) {
        this.asrHandler.process(buffer)
            .then(this.updateTranscription);
    }

    updateDownloadProgress(value) {
        this.setState({ downloadProgress: value * 100 });
    }

    downloadAndStore(modelName) {
        return new Promise((resolve, reject) => {
            this.setState({ appStatus: STATUSES.DOWNLOADING });
            trackedDownload('api/model', this.updateDownloadProgress)
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
        this.setState({ isRecordButtonDisabled: true, transcriptions: [] });

        this.resamplerHandler.start();
        this.setState({
            appStatus: STATUSES.RUNNING,
            isRecordButtonDisabled: false,
            startTime: Date.now(),
        });
    }

    stopASR() {
        this.setState({ isRecordButtonDisabled: true, endTime: Date.now() });

        const newState = {
            isRecordButtonDisabled: true,
            appStatus: STATUSES.ERROR,
        };

        this.resamplerHandler.stop()
            .then(() => this.asrHandler.reset())
            .then(this.updateTranscription)
            .then(() => {
                newState.appStatus = STATUSES.STANDBY;
                newState.isRecordButtonDisabled = false;
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
            isRecordButtonDisabled,
            downloadProgress,
            startTime,
            endTime,
        } = this.state;

        const classes = this.props.classes;


        const text = transcriptions.concat(tmpTranscription).join('\n');

        const round2dp = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
        const now = Date.now();
        const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
        const timeElapsed = ((appStatus === STATUSES.RUNNING ? now : endTime)
            - startTime) / 1000;
        const speakingRate = timeElapsed === 0 ? 0 : wordCount / timeElapsed;

        return (
            <>
                {(appStatus === STATUSES.STANDBY || appStatus === STATUSES.RUNNING) && (
                    <>
                        <Typography>
                            Please <strong>count out loud from one to thirty</strong> clearly at a fast but comfortable speaking pace.
                            <br />
                            <br />
                            When you are ready, press the button below to start recording. Once you reach thirty, press it again to stop recording should it not do so automatically.
                            <br />
                        </Typography>
                        <Box textAlign='center'>
                            <ToggleButton
                                onStart={this.startASR}
                                onStop={this.stopASR}
                                disabled={isRecordButtonDisabled}
                            />

                            {text}
                            <br /><br />
                            Words count:&nbsp;<span><strong>{wordCount}</strong></span><br />
                            Speaking rate (words/second):&nbsp;<span><strong>{round2dp(speakingRate)}</strong></span><br />
                            Speaking rate (words/minute):&nbsp;<span><strong>{round2dp(60 * speakingRate)}</strong></span><br />
                            Time elapsed (seconds):&nbsp;<span><strong>{timeElapsed}</strong></span>
                            <br /><br />
                        </Box>
                    </>
                )}

                {(appStatus === STATUSES.UNINITIALISED || appStatus === STATUSES.LOADING) && (
                    <Box textAlign='center' className={classes.statusBox}>
                        <Typography>Loading</Typography><br />
                        <CircularProgress />
                    </Box>
                )}

                {appStatus === STATUSES.DOWNLOADING && (
                    <Box textAlign='center' className={classes.statusBox}>
                        <Typography>Downloading the speech recognition model</Typography>
                        <LinearProgressWithLabel
                            value={downloadProgress}
                        />
                    </Box>
                )}

                {appStatus === STATUSES.ERROR && (
                    <>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            Apologies - something went wrong while loading the speech recognition module.<br /><br />
                            Reloading the app may fix your issue!
                        </Alert><br /><br />
                    </>
                )}
            </>
        );
    }
}

CountToThirtySpeech.defaultProps = {
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

export default withStyles(myStyles)(CountToThirtySpeech);

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

function ToggleButton({ disabled, onStart, onStop }) {
    const [standby, setStandby] = useState(true);

    function toggle() {
        setStandby(!standby);
        if (standby) {
            onStart();
        } else {
            onStop();
        }
    }

    return (
        <Button
            color={standby ? 'primary' : 'secondary'}
            disabled={disabled}
            onClick={toggle}
            variant="contained"
            endIcon={standby ? <Mic fontSize="large" /> : <Stop fontSize="large" />}
        >
            {standby ? 'Start' : 'Stop'}
        </Button>
    );
}
