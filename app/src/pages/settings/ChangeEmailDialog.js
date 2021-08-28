import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import { useState } from 'react';
import { isValidEmail } from '../../utils/validation';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangeEmailDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [value, setValue] = useState('');

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
        setValue('');
    };

    const handleChange = (event) => {
        setValue(event.target.value.toLowerCase());
    };

    const isInvalid = !isValidEmail(value);
    const attributes = (value && isInvalid) ? {
        error: true,
        helperText: "Please enter a valid email."
    } : {};

    return (
        <Dialog
            aria-labelledby="email-update-dialog-title"
            open={open}
            onClose={handleCancel}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="email-update-dialog-title">Update your email</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To update your email, please enter your new email address below.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={value}
                    onChange={handleChange}
                    {...attributes}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary" disabled={!value || isInvalid}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
