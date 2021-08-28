import { Button, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useState } from "react";
import { isNumeric } from "../../utils/utils";


function SnackbarAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    input: {
        width: '350px'
    }
});

export default function Transfer() {
    const classes = useStyles();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
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

    const handleFromChange = (event) => {
        setFrom(event.target.value);
    };

    const handleToChange = (event) => {
        setTo(event.target.value);
    };

    const handleSubmit = () => {
        fetch('/api/sro/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_id: from,
                to_id: to
            })
        }).then(res => {
            if (res.status !== 200) {
                throw new Error("Transfer failed.");
            }

            handleSnackbarOpen({
                severity: "success",
                message: "Patient data successfully transferred."
            });
        }).catch(e => {
            handleSnackbarOpen({
                severity: "error",
                message: "I'm sorry - this action could not be performed."
            });
        });
    };

    const isFromInvalid = !isNumeric(from) || +from <= 0;
    const fromAttributes = (from && isFromInvalid) ? {
        error: true,
        helperText: "Please enter a SRO ID."
    } : {};

    const isToInvalid = !isNumeric(to) || +to <= 0;
    const toAttributes = (to && isToInvalid) ? {
        error: true,
        helperText: "Please enter a SRO ID."
    } : {};

    return (<>
        <Typography>
            To transfer patients (and the associated submission data) from one SRO to another, please fill in the form below.
        </Typography>
        <br />
        <form noValidate autoComplete="off">
            <TextField
                className={classes.input}
                id="transfer-from"
                label="From SRO ID"
                variant="outlined"
                value={from}
                onChange={handleFromChange}
                {...fromAttributes}
            />
            <br /><br />
            <TextField
                className={classes.input}
                id="transfer-to"
                label="To SRO ID"
                variant="outlined"
                value={to}
                onChange={handleToChange}
                {...toAttributes}
            />
            <br /><br />
            <Button variant="contained" color="primary" disabled={!from || !to} onClick={handleSubmit}>
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
