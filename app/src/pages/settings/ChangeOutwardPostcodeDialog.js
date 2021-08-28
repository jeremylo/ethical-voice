import { DialogContentText, makeStyles, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { isValidOutwardPostcode } from '../../utils/validation';


const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangeOutwardPostcodeDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [value, setValue] = React.useState('');

    const handleCancel = () => {
        onClose();
        setValue('');
    };

    const handleOk = () => {
        onClose(value);
        setValue('');
    };

    const handleChange = (event) => {
        setValue(event.target.value.toUpperCase());
    };

    const isInvalid = !isValidOutwardPostcode(value);
    const attributes = (value && isInvalid) ? {
        error: true,
        helperText: "Please enter a valid outward postcode."
    } : {
        helperText: "Please enter the first part of your postcode (before the space)."
    };

    return (
        <Dialog
            aria-labelledby="outward-postcode-update-dialog-title"
            open={open}
            onClose={handleCancel}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="outward-postcode-update-dialog-title">Update your outward postcode</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter your new outward postcode identifying your postcode area and district below, e.g. SW1, M1 & W1A.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="outward-postcode"
                    label="Outward postcode"
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
