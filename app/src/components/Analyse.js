import { Container, Paper, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import React from 'react';
import Count from "./analysis/Count";
import MRCDyspnoea from "./analysis/MRCDyspnoea";
import Sputum from "./analysis/Sputum";
import Welcome from "./analysis/Welcome";
import Wellbeing from "./analysis/Wellbeing";


// const genericStep = (step, handleNext, setResults) => <>
//     <Typography>Step {step + 1}</Typography>
//     <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
// </>;

const steps = [
    {
        key: 'welcome',
        step: (step, handleNext, setResults) => <Welcome handleNext={handleNext} />
    },
    {
        key: 'speech',
        step: (step, handleNext, setResults) => <Count handleNext={handleNext} setResults={setResults} duration={10} />
    },
    {
        key: 'sputum',
        step: (step, handleNext, setResults) => <Sputum handleNext={handleNext} setResults={setResults} />
    },
    {
        key: 'wellbeing',
        step: (step, handleNext, setResults) => <Wellbeing handleNext={handleNext} setResults={setResults} />
    },
    {
        key: 'dyspnoea',
        step: (step, handleNext, setResults) => <MRCDyspnoea handleNext={handleNext} setResults={setResults} />
    },
]

export default class Analyse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            results: {}
        };
    }

    render() {
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

        const activeStep = this.state.activeStep;

        return (
            <div>
                <Container maxWidth="sm">
                    <br />
                    <Paper square elevation={0}>
                        <Typography variant="h5">Create a new submission</Typography>
                    </Paper>
                </Container>

                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel />
                        </Step>
                    ))}
                </Stepper>

                <Container maxWidth="sm">
                    {activeStep < steps.length ? steps[activeStep].step(activeStep, handleNext, setResults)
                        : <div>We've reached the end.
                            <br /><br />{console.log(this.state.results)}</div>}
                </Container>
            </div >
        );
    }
}
