import { Box, Button, CircularProgress, Paper, Typography, withStyles } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Component, default as React } from 'react';
import calculateResults from '../../services/speech/calculateResults';
import downloadFile from '../../services/speech/downloadFile';
import SpeechService from '../../services/speech/SpeechService';
import Countdown from './speech/Countdown';
import LabelledLinearProgress from './speech/LabelledLinearProgress';


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

        this.speech = new SpeechService();

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.handleResults = this.handleResults.bind(this);

        this.state = {
            appStatus: STATUSES.UNINITIALISED,
            showNext: false,
            downloadProgress: 0
        };
    }

    downloadModel = (saveModel) => {
        return new Promise((resolve, reject) => {
            this.setState({ appStatus: STATUSES.DOWNLOADING });
            downloadFile('api/model', (value) => {
                this.setState({ downloadProgress: value * 100 });
            }).then((zip) => {
                saveModel(zip)
                    .catch(console.error) // The model could not be saved, but we're proceeding anyway.
                    .finally(() => {
                        this.setState({ appStatus: STATUSES.LOADING });
                        resolve({ value: zip });
                    });
            }).catch(reject);
        });
    }

    componentDidMount() {
        try {
            this.setState({
                appStatus: STATUSES.LOADING,
                isRecordButtonDisabled: true,
            });

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Unable to access any media devices.");
            }

            this.speech.setup(this.downloadModel)
                .then(() => {
                    this.setState({
                        appStatus: STATUSES.STANDBY,
                        isRecordButtonDisabled: false,
                    });
                })
                .catch((e) => {
                    // console.error(e);
                    this.setState({
                        appStatus: STATUSES.ERROR,
                        isRecordButtonDisabled: true,
                    });
                });
        } catch (e) {
            this.setState({
                appStatus: STATUSES.ERROR,
                isRecordButtonDisabled: true,
            });
        }
    }

    componentWillUnmount() { // check
        this.speech.terminate();
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((microphone) => {
            this.setState({ appStatus: STATUSES.RECORDING, isRecordButtonDisabled: false });
            this.speech.startRecording(microphone);
        }).catch((error) => {
            console.error(error);
            this.setState({ // unable to access mic ! TODO: PUT A BETTER ERROR HERE
                isRecordButtonDisabled: true,
                appStatus: STATUSES.ERROR,
            });
        });
    }

    stopRecording() {
        if (this.state.isRecordButtonDisabled) return;

        this.setState({ appStatus: STATUSES.STANDBY });

        this.speech.stopRecording()
            .then(this.handleResults)
            .catch((e) => {
                console.error(e);
                this.setState({
                    isRecordButtonDisabled: true,
                    appStatus: STATUSES.ERROR,
                });
            });
    }

    handleResults({ audioBlob, transcription }) {
        this.setAudio(audioBlob);

        const results = calculateResults(transcription, this.props.duration);
        this.setResults(results);

        this.setState({
            isRecordButtonDisabled: false,
            appStatus: STATUSES.STANDBY,
            showNext: true,
            results: {
                wordsPerMinute: results.wordsPerMinute,
                syllablesPerMinute: results.syllablesPerMinute,
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
                                    <br /><strong>Words per minute</strong>: {this.state.results.wordsPerMinute}
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
                        <br />
                        <Typography color="textSecondary">This may take a few minutes.</Typography>
                        <br />
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
                            Reloading the app may fix your issue! If not, please ensure you have given permission for this app to access your microphone.
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
