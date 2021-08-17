import { Button, Checkbox, FormControlLabel, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useState } from "react";
import { isValidEmail } from "../utils";


function SnackbarAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    emailInput: {
        width: '350px'
    }
});

export default function Invite() {
    const classes = useStyles();
    const [value, setValue] = useState('');
    const [checked, setChecked] = useState(false);
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

    const handleChange = (event) => {
        setValue(event.target.value.toLowerCase());
    };

    const handleCheckedChange = (event) => {
        setChecked(!checked);
    };

    const handleSubmit = () => {
        fetch('/api/sro/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: value,
                trusted: checked
            })
        }).then(res => {
            if (res.status !== 200) {
                throw new Error("Invitation failed.");
            }

            handleSnackbarOpen({
                severity: "success",
                message: "An email invitation was sent to the email address."
            });
        }).catch(e => {
            handleSnackbarOpen({
                severity: "error",
                message: "I'm sorry - this action could not be performed."
            });
        });
    };

    const isInvalid = !isValidEmail(value);
    const attributes = (value && isInvalid) ? {
        error: true,
        helperText: "Please enter a valid email."
    } : {};

    return (<>
        <Typography>
            To invite a new senior responsible officer to join the service, please fill in the form below.
        </Typography>
        <br />
        <form noValidate autoComplete="off">
            <TextField
                className={classes.emailInput}
                id="invite-email"
                label="Email"
                variant="outlined"
                value={value}
                onChange={handleChange}
                {...attributes}
            />
            <br /><br />
            <FormControlLabel
                control={<Checkbox checked={checked} onChange={handleCheckedChange} name="checkedA" />}
                label="Should this SRO be trusted to invite and manage other SROs?"
            />
            <br /><br />
            <Button variant="contained" color="primary" disabled={!value || isInvalid} onClick={handleSubmit}>
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
