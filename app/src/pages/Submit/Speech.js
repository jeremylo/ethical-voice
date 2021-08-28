import { Box, Button, CircularProgress, Paper, Typography, withStyles } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Component, default as React } from 'react';
import LabelledLinearProgress from '../../components/LabelledLinearProgress/LabelledLinearProgress';
import calculateResults from '../../services/speech/calculateResults';
import downloadModel from '../../services/speech/downloadModel';
import SpeechService from '../../services/speech/SpeechService';
import Countdown from './speech/Countdown';


const myStyles = (theme) => ({
    statusBox: {
        marginTop: '1rem',
        marginBottom: '1rem',
    }
});

const STATUSES = {
    DOWNLOADING: 'downloading',
    ERROR: 'error',
    ERROR_PERMISSION_DENIED: 'error_permission_denied',
    LOADING: 'loading',
    RECORDING: 'recording',
    STANDBY: 'standby',
    UNINITIALISED: 'uninitialised',
};

/**
 * The Speech component records and analyses speech said over the course
 * of the duration selected on the previous screen.
 *
 * It forms one of the steps of the multi-step audio submission form.
 */
class Speech extends Component {

    /**
     * Initialises the state of the Speech component.
     *
     * Takes the following props:
     * - handleNext: a function which moves onto the next form step when called;
     * - setResults(object): a JSON object of metadata to be included in the submission;
     * - setAudio(audio): sets the audio BLOB of the submission;
     * - duration: the time in seconds to speak for; and
     * - (children): displayed above the timer
     *
     * @param   {object}  props  React props.
     */
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

    /**
     * Downloads the model from the API.
     *
     * @return  {Uint8Array}  The downloaded Kaldi model ZIP file.
     */
    download = () => {
        return new Promise((resolve, reject) => {
            this.setState({ appStatus: STATUSES.DOWNLOADING });
            downloadModel('api/model', (value) => {
                this.setState({ downloadProgress: value * 100 });
            }).then((zip) => {
                this.setState({ appStatus: STATUSES.LOADING });
                resolve(zip);
            }).catch(reject);
        });
    }

    /**
     * Setup to be performed as the component mounts.
     *
     * @return  {void}
     */
    componentDidMount() {
        try {
            this.setState({
                appStatus: STATUSES.LOADING,
                isRecordButtonDisabled: true,
            });

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Unable to access any media devices.");
            }

            this.speech.setup(this.download)
                .then(() => {
                    this.setState({
                        appStatus: STATUSES.STANDBY,
                        isRecordButtonDisabled: false,
                    });
                })
                .catch((e) => {
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

    /**
     * Tear-down to be performed as the component unmounts.
     *
     * @return  {void}
     */
    componentWillUnmount() {
        this.speech.terminate();
    }

    /**
     * Requests permission to use the user's microphone and then
     * initiates recording from the stream created until stopRecording()
     * is called.
     *
     * @return  {void}
     */
    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((microphone) => {
                this.setState({ appStatus: STATUSES.RECORDING, isRecordButtonDisabled: false });
                this.speech.startRecording(microphone);
            })
            .catch((error) => {
                this.setState({
                    isRecordButtonDisabled: true,
                    appStatus: STATUSES.ERROR_PERMISSION_DENIED,
                });
            });
    }

    /**
     * Stops recording and retrieves the audio so that
     * results may be calculated therefrom.
     *
     * @return  {void}
     */
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

    /**
     * Calculates results and adds them to the submission along with
     * the audio for the submission.
     *
     * @param   {Blob}    audioBlob      A BLOB of the audio recorded.
     * @param   {string}  transcription  The transcribed text of the audio.
     *
     * @return  {void}
     */
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

    /**
     * Renders the UI elements.
     */
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
                            Reloading the app may fix your issue!
                        </Alert><br /><br />
                    </>
                )}

                {appStatus === STATUSES.ERROR_PERMISSION_DENIED && (
                    <>
                        <Alert severity="error">
                            <AlertTitle>Error: microphone use blocked</AlertTitle>
                            Please grant this app permission to use your microphone in your browser's settings and create a new submission to continue.
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
