import { Box, Button, Paper, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

export default function Welcome({ handleNext, setResults }) {
    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Overview of the process</Typography>
            <Typography>
                In order to track your breathlessness symptoms over time, we are going to walk you through a series of questions and activities.
                <br />
                <br />
                As part of this process, you will be asked to speak out loud to record your voice for analysis, so please ensure that you are in a reasonably quiet area. These recordings will be shared with a group of clinician researchers.
                <br />
                <br />
                When you are ready to begin, press the start button below.
            </Typography>
            <br />

            <Box textAlign='center'>
                <Button variant="contained" color="primary" onClick={handleNext} endIcon={<KeyboardArrowRightIcon />}>Start</Button>
            </Box>
        </Paper>
    )
}
