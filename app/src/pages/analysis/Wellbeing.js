import { Box, Button, makeStyles, Paper, Slider, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    controlsBox: {
        '& > *': {
            margin: theme.spacing(1),
        },
    }
}));

const marks = [
    { value: 1, label: 'Low' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: 'High' },
];

export default function Wellbeing({ handleNext, setResults }) {
    const classes = useStyles();
    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Wellbeing</Typography>
            <Typography>
                Please rate your wellbeing between one (low) and ten (high) using the slider below.
            </Typography>

            <br />

            <Box textAlign='center' style={{ padding: "3rem 1rem 2rem 1rem" }}>
                <Slider
                    value={value}
                    onChange={handleChange}
                    defaultValue={7}
                    step={1}
                    marks={marks}
                    min={1}
                    max={10}
                    valueLabelDisplay="on"
                    getAriaValueText={(text) => text}
                />
            </Box>

            <Box textAlign='center' className={classes.controlsBox}>
                <Button variant="contained" color="primary" onClick={() => handleNext()} endIcon={<KeyboardArrowRightIcon />}>Skip</Button>
                <Button variant="contained" color="primary" onClick={() => {
                    setResults(value);
                    handleNext();
                }} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
            </Box>
        </Paper >
    )
}
