import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useState } from "react";


const useStyles = makeStyles((theme) => ({
    selectedSputum: {
        fontWeight: "900",
        textDecorationStyle: "underline"
    },
    controlsBox: {
        '& > *': {
            margin: theme.spacing(1),
        },
    }
}));


export const sputumColours = [
    {
        name: "White",
        value: 1,
        colour: "#FEFEE4"
    },
    {
        name: "Cream",
        value: 2,
        colour: "#F5F7C8"
    },
    {
        name: "Yellow",
        value: 3,
        colour: "#E4E681"
    },
    {
        name: "Pale green",
        value: 4,
        colour: "#B9BB70"
    },
    {
        name: "Green",
        value: 5,
        colour: "#94A265"
    },
];

export default function CountToThirty({ handleNext, setResults }) {
    const classes = useStyles();

    const [value, setValue] = useState(null);

    const handleChange = (event, nextvalue) => {
        setValue(nextvalue);
    };

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Sputum</Typography>
            <Typography>
                Please select the colour which most closely resembles your sputum.
            </Typography>

            <br />

            <Box textAlign='center'>
                <ToggleButtonGroup orientation="vertical" value={value} exclusive onChange={handleChange} style={{ width: '100%' }}>
                    {sputumColours.map((sputumColour) =>
                        <ToggleButton
                            key={sputumColour.value}
                            value={sputumColour.value}
                            aria-label={sputumColour.name}
                            style={{ backgroundColor: sputumColour.colour }}
                            classes={{
                                selected: classes.selectedSputum
                            }}
                        >
                            {sputumColour.name} ({sputumColour.value})
                        </ToggleButton>)}
                </ToggleButtonGroup>
            </Box>

            <br />

            <Box textAlign='center' className={classes.controlsBox}>
                <Button variant="contained" color="primary" onClick={() => handleNext()} endIcon={<KeyboardArrowRightIcon />}>Skip</Button>
                <Button variant="contained" color="primary" onClick={() => {
                    setResults(value);
                    handleNext();
                }} endIcon={<KeyboardArrowRightIcon />} disabled={!value}>Next</Button>
            </Box>
        </Paper >
    )
}
