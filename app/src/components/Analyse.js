import { Container, Paper, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from 'react';
import MRCDyspnoea from "./analysis/MRCDyspnoea";
import Speech from "./analysis/Speech";
import Sputum from "./analysis/Sputum";
import Welcome from "./analysis/Welcome";
import Wellbeing from "./analysis/Wellbeing";


// const genericStep = (step, handleNext, setResults) => <>
//     <Typography>Step {step + 1}</Typography>
//     <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
// </>;

const defaultTests = [
    {
        id: 0,
        possibleDurations: [10, 30, 60, 90, 120],
        title: "Counting numbers",
        instruction: "Please count out loud up from one clearly at a fast but comfortable speaking pace until the timer runs out."
    }
];

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);

        this.selectTest = this.selectTest.bind(this);
        this.selectDuration = this.selectDuration.bind(this);

        this.state = {
            activeStep: 0,
            results: {},
            selectedTest: 0,
            selectedDuration: 30,
            tests: defaultTests
        };
    }

    selectTest(selectedTest) {
        this.setState(state => ({
            selectedTest,
            selectedDuration: state.tests.possibleDurations[0] ?? 30
        }))
    }

    selectDuration(selectedDuration) {
        this.setState({ selectedDuration })
    }

    componentDidMount() {
        fetch('/api/tests')
            .then(response => response.json())
            .then(tests => {
                this.setState({ tests });
            })
            .catch(() => {
                this.setState({ tests: defaultTests });
            });
    }

    render() {
        const steps = [
            {
                key: 'welcome',
                step: (handleNext, _) => <Welcome
                    handleNext={handleNext}
                    tests={this.state.tests}
                    selectTest={this.selectTest}
                    selectDuration={this.selectDuration}
                    sharingEnabled />
            },
            {
                key: 'speech',
                step: (handleNext, setResults) => <Speech
                    handleNext={handleNext}
                    setResults={setResults}
                    duration={this.state.selectedDuration}
                >
                    <Typography>
                        When you are ready, press the microphone to start recording.
                    </Typography> <br />

                    <Alert severity="info" icon={false}>
                        <AlertTitle>Task</AlertTitle>
                        <Typography>{this.state.tests[this.state.selectedTest].instruction}</Typography>
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


        const handleNext = () => {
            this.setState((state) => ({
                activeStep: state.activeStep + 1
            }));
        };

        // const handleBack = () => {
        //     this.setState({
        //         activeStep: this.state.activeStep - 1
        //     });
        // };

        const setResults = (results) => {
            this.setState((state) => ({
                results: {
                    ...state.results,
                    [steps[state.activeStep].key]: results
                }
            }))
        }

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
                        : <div>We've reached the end.
                            <br /><br />{console.log(this.state.results)}</div>}
                </Container>
            </div >
        );
    }
}
