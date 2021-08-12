import { Box, Button, CircularProgress, Paper, Typography, withStyles } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Component, default as React } from 'react';
import { syllable } from 'syllable';
import { trackedDownload } from './kaldi/utils/downloadModel';
import ASRHandler from './kaldi/workerWrappers/asrHandler';
import IDBHandler from './kaldi/workerWrappers/idbHandler';
import Countdown from './speech/Countdown';
import LabelledLinearProgress from './speech/LabelledLinearProgress';


const round2dp = (x) => Math.round((x + Number.EPSILON) * 100) / 100;

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
    RECORDING: 'recording',
    STANDBY: 'standby',
    UNINITIALISED: 'uninitialised',
};

class Speech extends Component {

    constructor(props) {
        super(props);

        this.handleNext = props.handleNext;
        this.setResults = props.setResults;
        this.setAudio = props.setAudio;

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.loadModel = this.loadModel.bind(this);
        this.downloadModel = this.downloadModel.bind(this);
        this.handleResults = this.handleResults.bind(this);

        this.recorder = null;
        this.idbHandler = null;
        this.asrHandler = null;

        this.state = {
            appStatus: STATUSES.UNINITIALISED,
            showNext: false,
            downloadProgress: 0,
            audioBlob: null
        };
    }

    componentDidMount() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.setState({
                appStatus: STATUSES.ERROR,
                isRecordButtonDisabled: false,
            });
            return;
        }

        this.idbHandler = new IDBHandler();
        this.asrHandler = new ASRHandler();

        this.idbHandler.init({
            name: 'asr_models',
            version: 1,
            storeInfo: {
                name: 'models',
                keyPath: 'language',
            },
        }).then(() => {
            this.loadModel();
        });
    }

    componentWillUnmount() {
        if (this.idbHandler) {
            this.idbHandler.terminate();
            this.idbHandler = null;
        }

        if (this.asrHandler) {
            this.asrHandler.terminate();
            this.asrHandler = null;
        }

        this.recorder = null;
    }

    loadModel() {
        this.setState({
            appStatus: STATUSES.LOADING,
            isRecordButtonDisabled: true,
        });

        this.idbHandler.get('model')
            .catch(() => this.downloadModel())
            .then(({ value: zip }) => new Promise((resolve, reject) => {
                this.asrHandler.terminate()
                    .then(() => { resolve(this.asrHandler.init('model', zip)); })
                    .catch(reject);
            }))
            //.then(() => this.asrHandler.getSampleRate())
            .then(() => {
                this.setState({
                    appStatus: STATUSES.STANDBY,
                    isRecordButtonDisabled: false,
                });
            })
            .catch((e) => {
                console.error(e);
                this.setState({
                    appStatus: STATUSES.ERROR,
                    isRecordButtonDisabled: true,
                });
            });
    }

    downloadModel() {
        return new Promise((resolve, reject) => {
            this.setState({ appStatus: STATUSES.DOWNLOADING });
            trackedDownload('api/model', (value) => {
                this.setState({ downloadProgress: value * 100 });
            })
                .then((zip) => {
                    this.idbHandler.add('model', zip)
                        .catch(console.error) // The model could not be saved, but we're proceeding anyway.
                        .finally(() => {
                            this.setState({ appStatus: STATUSES.LOADING });
                            resolve({ value: zip });
                        });
                })
                .catch(reject);
        });
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((microphone) => {
            this.setState({ appStatus: STATUSES.RECORDING, isRecordButtonDisabled: false });

            this.recorder = window.RecordRTC(microphone, {
                type: 'audio',
                mimeType: 'audio/webm',
                recorderType: window.StereoAudioRecorder,
                numberOfAudioChannels: 1,
                desiredSampRate: 16000
            });

            this.recorder.startRecording();

            // remember to release the microphone on stopRecording
            this.recorder.microphone = microphone;
        }).catch(function (error) {
            console.error(error);
            this.setState({ // unable to access mic ! TODO PUT A BETTER ERROR HERE
                isRecordButtonDisabled: true,
                appStatus: STATUSES.ERROR,
            });
        });
    }

    stopRecording() {
        if (this.state.isRecordButtonDisabled) return;

        this.setState({ appStatus: STATUSES.STANDBY });
        this.recorder.stopRecording(() => {
            this.recorder.microphone.stop();
            const blob = this.recorder.getBlob();
            this.setState({ audioBlob: blob });
            blob.arrayBuffer()
                .then((buffer) =>
                    this.asrHandler.process(new Int16Array(buffer)) // PCM
                )
                .then(({ text }) => {
                    this.handleResults(text);
                    return this.asrHandler.reset();
                })
                .catch(() => {
                    this.setState({
                        isRecordButtonDisabled: true,
                        appStatus: STATUSES.ERROR,
                    });
                });
            this.recorder.microphone.getAudioTracks().forEach(track => track.stop());
        });
    }

    handleResults(transcription) {
        const words = transcription.split(/\s+/).filter((w) => w.length > 0);

        const durationInMinutes = this.props.duration / 60;
        const wordsPerMinute = round2dp(words.length / durationInMinutes);
        const syllables = words.map(syllable).reduce((a, b) => a + b, 0);
        const syllablesPerMinute = round2dp(syllables / durationInMinutes);

        this.setAudio(this.state.audioBlob);

        this.setResults({
            syllableCount: syllables,
            syllablesPerMinute,
            wordCount: words.length,
            wordsPerMinute,
            transcription: words.join(" "),
            duration: this.props.duration
        });

        this.setState({
            isRecordButtonDisabled: false,
            appStatus: STATUSES.STANDBY,
            showNext: true,
            results: {
                wordsPerMinute,
                syllablesPerMinute,
            }
        });
    }

    render() {
        const { appStatus, downloadProgress, isRecordButtonDisabled } = this.state;
        const { classes } = this.props;

        return (
            <Paper square elevation={0}>
                <Typography variant="h6">Create a recording</Typography>
                {(appStatus === STATUSES.STANDBY || appStatus === STATUSES.RECORDING) && (
                    <>
                        {this.props.children}
                        <Box textAlign='center' className={classes.statusBox}>
                            {this.state.results
                                ? <Alert severity="success" style={{ textAlign: 'left' }}>
                                    <AlertTitle>Results</AlertTitle>
                                    <strong>Syllables per minute</strong>: {this.state.results.syllablesPerMinute}
                                    {/* <br /><strong>Words per minute</strong>: {this.state.results.wordsPerMinute} */}
                                </Alert> : <Countdown
                                    running={appStatus === STATUSES.RECORDING}
                                    duration={this.props.duration}
                                    handleStart={this.startRecording}
                                    handleStop={this.stopRecording}
                                    disabled={isRecordButtonDisabled}
                                />
                            }
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

                {this.state.showNext && <Box textAlign='center'>
                    <Button variant="contained" color="primary" onClick={this.handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
                </Box>}
            </Paper>
        );
    }

}

export default withStyles(myStyles)(Speech);
