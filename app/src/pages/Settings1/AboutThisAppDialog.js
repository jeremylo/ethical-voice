import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, makeStyles } from '@material-ui/core';

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
