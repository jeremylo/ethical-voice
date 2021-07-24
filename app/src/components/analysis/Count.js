import { Box, Button, CircularProgress, Paper, Typography, withStyles } from '@material-ui/core';
import { Mic, Stop } from '@material-ui/icons';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from 'react';
import LabelledLinearProgress from './count/LabelledLinearProgress';
import { trackedDownload } from './kaldi/utils/downloadModel';
import ASRHandler from './kaldi/workerWrappers/asrHandler';
import IDBHandler from './kaldi/workerWrappers/idbHandler';
import ResampleHandler from './kaldi/workerWrappers/resamplerHandler';



const DURATION = 10;


const myStyles = (theme) => ({
    statusBox: {
        marginTop: '1rem',
        marginBottom: '1rem',
    }
});

const STATUSES = {
    DOWNLOADING: 'downloading',
    ERROR: 'error',
    LOADING: 'loading',
    RUNNING: 'running',
    STANDBY: 'standby',
    UNINITIALISED: 'uninitialised',
};

class Count extends React.Component {
    constructor(props) {
        super(props);

        this.handleNext = props.handleNext;
        this.setResults = props.setResults;

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
            .catch(() => this.downloadAndStore())
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

    downloadAndStore() {
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
        });
    }

    stopASR() {
        this.setState({ isRecordButtonDisabled: true });

        this.resamplerHandler.stop()
            .then(() => this.asrHandler.reset())
            .then(this.updateTranscription)
            .then(() => {
                this.setState({
                    isRecordButtonDisabled: false,
                    appStatus: STATUSES.STANDBY,
                });
            })
            .catch(() => {
                this.setState({
                    isRecordButtonDisabled: true,
                    appStatus: STATUSES.ERROR,
                });
            });
    }

    render() {
        const {
            transcriptions,
            tmpTranscription,
            appStatus,
            isRecordButtonDisabled,
            downloadProgress,
        } = this.state;

        const classes = this.props.classes;

        const text = transcriptions.concat(tmpTranscription).join('\n');

        return (
            <Paper square elevation={0}>
                <Typography variant="h6">Speaking rate evaluation</Typography>
                {(appStatus === STATUSES.STANDBY || appStatus === STATUSES.RUNNING) && (
                    <>
                        <Typography>
                            When you are ready, please press the button below to commence recording, and <strong>start counting out loud</strong> from one clearly at a fast but comfortable speaking pace until the timer runs out.
                            <br />
                        </Typography>
                        <Box textAlign='center' className={classes.statusBox}>
                            <ToggleButton
                                onStart={this.startASR}
                                onStop={this.stopASR}
                                disabled={isRecordButtonDisabled}
                            />

                            {text}
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
                        <LabelledLinearProgress
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

                <Box textAlign='center'>
                    <Button variant="contained" color="primary" onClick={this.handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
                </Box>
            </Paper>
        );
    }
}

Count.defaultProps = {
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

export default withStyles(myStyles)(Count);

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
            fullWidth={true}
        >
            {standby ? 'Start' : 'Stop'}
        </Button>
    );
}
