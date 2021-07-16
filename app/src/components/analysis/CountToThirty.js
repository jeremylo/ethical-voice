import { Box, Button, Paper, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

export default function CountToThirty({ handleNext, setResults }) {
    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Speaking rate evaluation</Typography>
            <Typography>
                TODO!
            </Typography>
            <br />

            <Box textAlign='center'>
                <Button variant="contained" color="primary" onClick={handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
            </Box>
        </Paper>
    )
}
