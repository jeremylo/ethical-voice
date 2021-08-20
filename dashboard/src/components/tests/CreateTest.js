import { Button, Checkbox, FormControlLabel, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useState } from "react";


function SnackbarAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    input: {
        width: '500px',
        maxWidth: '70vw'
    }
});

const validatePossibleDurationsList = (durations) => {
    for (const duration of durations) {
        if (+duration < 5 || +duration >= 1000) return false;
    }
    return true;
};

export default function CreateTest({ refresh }) {
    const classes = useStyles();
    const [title, setTitle] = useState('');
    const [instruction, setInstruction] = useState('');
    const [possibleDurations, setPossibleDurations] = useState('');
    const [active, setActive] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "success",
        message: "Success!"
    });

    const handleSnackbarOpen = (properties) => {
        setOpen(true);
        setSnackbarProperties(properties);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleInsturctionChange = (event) => {
        setInstruction(event.target.value);
    };

    const handlePossibleDurationsChange = (event) => {
        setPossibleDurations(event.target.value);
    };

    const handleActiveChange = (event) => {
        setActive(!active);
    };

    const handleSubmit = () => {
        fetch('/api/tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title, instruction, active,
                possibleDurations: possibleDurations.split(/\s*,\s*/).map(x => +x)
            })
        }).then(res => {
            if (res.status !== 200) {
                throw new Error("Failure.");
            }

            handleSnackbarOpen({
                severity: "success",
                message: "New test type created successfully."
            });
            refresh();
        }).catch(e => {
            handleSnackbarOpen({
                severity: "error",
                message: "I'm sorry - this action could not be performed."
            });
        });
    };

    const isTitleInvalid = title.length > 255;
    const titleAttributes = (title && isTitleInvalid) ? {
        error: true,
        helperText: "Please enter a valid, short test title (under 255 characters)."
    } : {};

    const isInstructionInvalid = instruction.length >= 65536;
    const instructionAttributes = (instruction && isInstructionInvalid) ? {
        error: true,
        helperText: "Please enter a valid test type instruction."
    } : {};

    const isPossibleDurationsValid = possibleDurations
        && possibleDurations.length <= 255
        && /[0-9]+(\s*,\s*[0-9]+)*/.test(possibleDurations)
        && validatePossibleDurationsList(possibleDurations.split(/\s*,\s*/))
        ;

    return (<>
        <Typography>
            To create a new test type, please fill in the form below. When choosing a title, you may want to ensure it is sufficiently distinct from existing test type titles for the benefit of the app users.
        </Typography>
        <br />
        <form noValidate autoComplete="off">
            <TextField
                className={classes.input}
                id="new-test-title"
                label="Title"
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                {...titleAttributes}
            />
            <br /><br />
            <TextField
                className={classes.input}
                id="new-test-instruction"
                label="Instructions"
                variant="outlined"
                value={instruction}
                onChange={handleInsturctionChange}
                {...instructionAttributes}
                multiline
                rows={4}
            />
            <br /><br />
            <TextField
                className={classes.input}
                id="new-test-possible-durations"
                label="Possible durations"
                variant="outlined"
                value={possibleDurations}
                onChange={handlePossibleDurationsChange}
                error={possibleDurations && !isPossibleDurationsValid}
                helperText="Please enter a comma-separated list of the allowable durations for this test in seconds."
            />
            <br /><br />

            <FormControlLabel
                control={<Checkbox checked={active} onChange={handleActiveChange} name="activeChecked" />}
                label="Enabled immediately on creation"
            />
            <br /><br />
            <Button variant="contained" color="primary" disabled={!title || !instruction || !possibleDurations} onClick={handleSubmit}>
                Submit
            </Button>
        </form>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleSnackbarClose}>
            <SnackbarAlert onClose={handleSnackbarClose} severity={snackbarProperties.severity}>
                {snackbarProperties.message}
            </SnackbarAlert>
        </Snackbar>
    </>);
}
