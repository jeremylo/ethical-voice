import { DialogContentText, makeStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { isValidEmail } from '../../utils/validation';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangeEmailDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [value, setValue] = React.useState('');

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
