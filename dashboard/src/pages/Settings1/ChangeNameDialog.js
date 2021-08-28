import { DialogContentText, makeStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { isValidName } from '../../utils/validation';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangeNameDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [value, setValue] = React.useState('');

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value.replace(/\s+/g, ' ').trim());
        setValue('');
    };

    const handleChange = (event) => {
        setValue(event.target.value.replace(/\s\s+/g, ' '));
    };

    const isInvalid = !isValidName(value.trim());
    const attributes = (value && isInvalid) ? {
        error: true,
        helperText: "Please enter a valid name."
    } : {};

    return (
        <Dialog
            aria-labelledby="name-update-dialog-title"
            open={open}
            onClose={handleCancel}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="name-update-dialog-title">Update your name</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the new name by which you would like to be addressed below.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="name"
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
