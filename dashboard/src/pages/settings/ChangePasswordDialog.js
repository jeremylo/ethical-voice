import { DialogContentText, makeStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { isValidPassword } from '../../utils/utils';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangePasswordDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose([currentPassword, newPassword]);
        setCurrentPassword('');
        setNewPassword('');
    };

    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value.toLowerCase());
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value.toLowerCase());
    };

    const currentPasswordAttributes = {};

    const isInvalid = !isValidPassword(newPassword);
    const attributes = (newPassword && isInvalid) ? {
        error: true,
        helperText: "Please enter a valid new password that is at least 10 characters in length."
    } : {};

    return (
        <Dialog
            aria-labelledby="password-update-dialog-title"
            open={open}
            onClose={handleCancel}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="password-update-dialog-title">Update your password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To update your password, please fill in the form below.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="current-password"
                    label="Current password"
                    type="password"
                    fullWidth
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    {...currentPasswordAttributes}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="new-password"
                    label="New password"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    {...attributes}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary" disabled={!currentPassword || !newPassword || isInvalid}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
