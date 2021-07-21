import { Box, Button, Paper, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Component } from "react";
import CountToThirtySpeech from "./kaldi/CountToThirtySpeech";


export default class CountToThirty extends Component {

    constructor(props) {
        super(props);
        this.handleNext = props.handleNext;
        this.setResults = props.setResults;
    }

    render() {
        return (
            <Paper square elevation={0}>
                <Typography variant="h6">Speaking rate evaluation</Typography>

                <CountToThirtySpeech />

                <Box textAlign='center'>
                    <Button variant="contained" color="primary" onClick={this.handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
                </Box>
            </Paper>
        )
    }
}
