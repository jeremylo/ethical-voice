import { Box, Button, FormControl, FormControlLabel, FormLabel, makeStyles, Paper, Radio, RadioGroup, Typography } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    controlsBox: {
        '& > *': {
            margin: theme.spacing(1),
        },
    }
}));


export default function MRCDyspnoea({ handleNext, setResults }) {
    const classes = useStyles();

    const [value, setValue] = React.useState(null);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Dyspnoea</Typography>
            <Typography>
                Please rate your dyspnoea condition according to the MRC Dyspnoea Scale below.
            </Typography>
            <br />
            <FormControl component="fieldset">
                <FormLabel component="legend">MRC Dyspnoea Scale</FormLabel>
                <br />
                <RadioGroup aria-label="mrc-dyspnoea-scale" name="mrcdyspnoea" value={value} onChange={handleChange}>
                    <FormControlLabel value='1' control={<Radio />} label='1 — I am not troubled by breathlessness, except on strenuous exertion.' />
                    <br />
                    <FormControlLabel value='2' control={<Radio />} label='2 — I am short of breath when hurrying on the level or walking up a slight hill.' />
                    <br />
                    <FormControlLabel value='3' control={<Radio />} label='3 — I have to walk slower than most people on the level and stop after a mile or so (or after 15 minutes) on the level at my own pace.' />
                    <br />
                    <FormControlLabel value='4' control={<Radio />} label='4 — I have to stop for breath after walking about 100 yards (or after a few minutes) on the level.' />
                    <br />
                    <FormControlLabel value='5' control={<Radio />} label='5 — I am too breathless to leave the house, or breathless after undressing.' />
                </RadioGroup>
            </FormControl>

            <Box textAlign='center' className={classes.controlsBox}>
                <br />
                <Button variant="contained" color="primary" onClick={() => handleNext()} endIcon={<KeyboardArrowRightIcon />}>Skip</Button>
                <Button variant="contained" color="primary" onClick={() => {
                    setResults(+value);
                    handleNext();
                }} endIcon={<KeyboardArrowRightIcon />} disabled={!value}>Next</Button>
            </Box>
        </Paper>
    );
}
