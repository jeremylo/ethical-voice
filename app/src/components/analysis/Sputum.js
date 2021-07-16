import { Box, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useState } from "react";


const useStyles = makeStyles((theme) => ({
    selectedSputum: {
        fontWeight: "900",
        textDecorationStyle: "underline"
    }
}));


const sputumColours = [
    {
        name: "White",
        value: "white",
        colour: "#FEFEE4"
    },
    {
        name: "Cream",
        value: "cream",
        colour: "#F5F7C8"
    },
    {
        name: "Yellow",
        value: "yellow",
        colour: "#E4E681"
    },
    {
        name: "Pale green",
        value: "palegreen",
        colour: "#B9BB70"
    },
    {
        name: "Green",
        value: "green",
        colour: "#94A265"
    },
];

export default function CountToThirty({ handleNext, setResults }) {
    const classes = useStyles();

    const [view, setView] = useState(null);

    const handleChange = (event, nextView) => {
        setView(nextView);
    };

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Sputum</Typography>
            <Typography>
                Please select the colour which most closely resembles your sputum.
            </Typography>

            <br />

            <Box textAlign='center'>
                <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={handleChange} style={{ width: '100%' }}>
                    {sputumColours.map((sputumColour) =>
                        <ToggleButton
                            value={sputumColour.value}
                            aria-label={sputumColour.name}
                            style={{ backgroundColor: sputumColour.colour }}
                            classes={{
                                selected: classes.selectedSputum
                            }}
                        >
                            {sputumColour.name}
                        </ToggleButton>)}
                </ToggleButtonGroup>
            </Box>

            <br />

            {view && <Box textAlign='center'>
                <Button variant="contained" color="primary" onClick={handleNext} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
            </Box>}
        </Paper >
    )
}
