import { Box, Button, Paper, Slider, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const marks = [
    {
        value: 1,
        label: 'Worst'
    },
    {
        value: 2,
    },
    {
        value: 3,
    },
    {
        value: 4,
    },
    {
        value: 5,
    },
    {
        value: 6,
    },
    {
        value: 7,
    },
    {
        value: 8,
    },
    {
        value: 9,
    },
    {
        value: 10,
        label: 'Best'
    },
];

export default function Wellbeing({ handleNext, setResults }) {

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Wellbeing</Typography>
            <Typography>
                Please rate your wellbeing between one and ten using the slider below.
            </Typography>

            <br />

            <Box textAlign='center' style={{ padding: "1rem" }}>
                <div>
                    <br />
                    <br />
                    <Slider
                        defaultValue={7}
                        step={1}
                        marks={marks}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        getAriaValueText={(text) => text}
                    />
                </div>
            </Box>

            <br />

            {true && <Box textAlign='center'>
                <Button variant="contained" color="primary" onClick={handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
            </Box>}
        </Paper >
    )
}
