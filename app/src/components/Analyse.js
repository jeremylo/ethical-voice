import { Container, Paper, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from 'react';
import { addResult } from "../persistence/db";
import getTests, { defaultTests } from "../persistence/tests";
import Completion from "./analysis/Completion";
import MRCDyspnoea from "./analysis/MRCDyspnoea";
import Speech from "./analysis/Speech";
import Sputum from "./analysis/Sputum";
import { SUBMISSION_STATUSES } from "./analysis/submission_statuses";
import Welcome from "./analysis/Welcome";
import Wellbeing from "./analysis/Wellbeing";


const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);

        this.selectTest = this.selectTest.bind(this);
        this.selectDuration = this.selectDuration.bind(this);
        this.getSteps = this.getSteps.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

        this.state = {
            activeStep: 0,
            results: {},
            selectedTest: 0,
            selectedDuration: 30,
            tests: defaultTests
        };
    }

    selectTest(selectedTest) {
        this.setState({ selectedTest });
    }

    selectDuration(selectedDuration) {
        this.setState({ selectedDuration });
    }

    getSteps() {
        return [
            {
                key: 'welcome',
                step: (handleNext, _) => <Welcome
                    handleNext={handleNext}
                    tests={this.state.tests}
                    selectTest={this.selectTest}
                    selectDuration={this.selectDuration}
                />
            },
            {
                key: 'speech',
                step: (handleNext, setResults) => <Speech
                    handleNext={handleNext}
                    setResults={setResults}
                    setAudio={(audio) => {
                        this.setState(state => ({
                            audio,
                            results: {
                                testId: state.selectedTest,
                                createdAt: Date.now(),
                                ...state.results
                            }
                        }));
                    }}
                    duration={this.state.selectedDuration}
                >
                    <Typography>
                        When you are ready, press the microphone to start recording.
                    </Typography> <br />

                    <Alert severity="info" icon={false}>
                        <AlertTitle>Task</AlertTitle>
                        <Typography>{this.state.tests[this.state.selectedTest] ? this.state.tests[this.state.selectedTest].instruction : "Error."}</Typography>
                    </Alert>
                </Speech>
            },
            {
                key: 'sputum',
                step: (handleNext, setResults) => <Sputum handleNext={handleNext} setResults={setResults} />
            },
            {
                key: 'wellbeing',
                step: (handleNext, setResults) => <Wellbeing handleNext={handleNext} setResults={setResults} />
            },
            {
                key: 'dyspnoea',
                step: (handleNext, setResults) => <MRCDyspnoea handleNext={handleNext} setResults={setResults} />
            },
        ];
    }

    async saveLocally(data, sharingEnabled, referenceId) {
        try {
            await addResult({
                audio: this.state.audio,
                shared: sharingEnabled,
                ...data
            }, referenceId);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }

    }

    async handleSubmission(sharingEnabled, referenceId) {
        if (!await this.saveLocally(this.state.results, sharingEnabled, referenceId)) {
            return SUBMISSION_STATUSES.LOCAL_ERROR;
        }

        if (!sharingEnabled) {
            return SUBMISSION_STATUSES.LOCAL_SUCCESS;
        }

        if (this.state.audio.size > MAX_FILE_SIZE) {
            return SUBMISSION_STATUSES.TOO_LARGE_TO_SUBMIT;
        }

        // Share results with the API
        const formData = new FormData();
        Object.entries(this.state.results).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append('audio', this.state.audio);

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                body: formData,
            });
            return res.status === 200 && ((await res.json()).success ?? false)
                ? SUBMISSION_STATUSES.SUCCESS_SUBMITTING : SUBMISSION_STATUSES.ERROR_SUBMITTING;
        } catch (e) {
            return SUBMISSION_STATUSES.ERROR_SUBMITTING;
        }
    }

    async componentDidMount() {
        this.setState({
            tests: await getTests()
        });
    }

    render() {
        const steps = this.getSteps();

        const handleNext = () => {
            this.setState((state) => ({
                activeStep: state.activeStep + 1
            }));
        };

        const setResults = (results) => {
            this.setState((state) => ({
                results: {
                    ...state.results,
                    ...(typeof results === 'object' ?
                        Object.fromEntries(Object.entries(results)
                            .map(([k, v]) => [steps[state.activeStep].key + '.' + k, v])
                        ) : { [steps[state.activeStep].key]: results }
                    )
                }
            }));
        };

        return (
            <div>
                <Container maxWidth="sm">
                    <br />
                    <Paper square elevation={0}>
                        <Typography variant="h5">Create a new submission</Typography>
                    </Paper>
                </Container>

                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel />
                        </Step>
                    ))}
                </Stepper>

                <Container maxWidth="sm">
                    {this.state.activeStep < steps.length ? steps[this.state.activeStep].step(handleNext, setResults)
                        : <Completion
                            results={this.state.results}
                            tests={this.state.tests}
                            handleSubmission={this.handleSubmission}
                        />}
                </Container>
            </div >
        );
    }
}
