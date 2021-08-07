import { Container, Paper, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from 'react';
import { addResult } from "../persistence/db";
import Completion from "./analysis/Completion";
import MRCDyspnoea from "./analysis/MRCDyspnoea";
import Speech from "./analysis/Speech";
import Sputum from "./analysis/Sputum";
import Welcome from "./analysis/Welcome";
import Wellbeing from "./analysis/Wellbeing";


const defaultTests = {
    1: {
        id: 1,
        possibleDurations: [10, 30, 60, 90, 120],
        title: "Counting numbers",
        instruction: "Please count out loud up from one clearly at a fast but comfortable speaking pace until the timer runs out."
    },
    2: {
        id: 2,
        possibleDurations: [10, 30, 60, 90, 120],
        title: "Repeating hippopotamus",
        instruction: "Please repeatedly say 'hippopotamus' at a fast but comfortable speaking pace until the timer runs out."
    },
};

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

    async saveLocally(data, sharingEnabled) {
        try {
            await addResult({
                audio: this.state.audio,
                shared: sharingEnabled,
                ...data
            });
            return true;
        } catch (e) {
            return false;
        }

    }

    async handleSubmission(sharingEnabled) {
        if (!await this.saveLocally(this.state.results, sharingEnabled)) {
            return false;
        }

        if (sharingEnabled) {
            // TODO: share it with the server
        }

        return true;
    }

    componentDidMount() {
        fetch('/api/tests')
            .then(response => response.json())
            .then(tests => {
                if (Object.keys(tests).length > 0) {
                    this.setState({ tests });
                }
            })
            .catch(() => {
                this.setState({ tests: defaultTests });
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
                            test={this.state.selectedTest}
                            duration={this.state.selectedDuration}
                            handleSubmission={this.handleSubmission}
                        />}
                </Container>
            </div >
        );
    }
}
