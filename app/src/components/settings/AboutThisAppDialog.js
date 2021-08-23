import { DialogContentText, Link, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function AboutThisApp(props) {
    const classes = useStyles();

    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            aria-labelledby="about-dialog-title"
            open={open}
            onClose={handleClose}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="about-dialog-title">About this app</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    The purpose of this app is to allow you to both track your symptoms over time and potentially share this data so that it may contribute towards breathlessness research.
                    <br /><br />
                    This app is open-source and available on <Link href="https://github.com/jeremylo/ethical-voice">GitHub (jeremylo/ethical-voice)</Link>.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
