import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@material-ui/core';
import { useRef } from 'react';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
    audio: {
        width: '100%',
        display: 'block'
    }
});

export default function PlayAudioDialog({ onClose, open, audio }) {
    const classes = useStyles();
    const audioRef = useRef(null);

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            aria-labelledby="play-audio-dialog-title"
            open={open}
            onClose={handleClose}
            keepMounted
            className={classes.paper}
            fullWidth
            TransitionProps={{
                onEntered: () => {
                    audioRef.current.src = window.URL.createObjectURL(audio);
                },
                onExit: () => {
                    audioRef.current.pause();
                }
            }}
        >
            <DialogTitle id="play-audio-dialog-title">Play submission audio</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <audio
                        ref={audioRef}
                        type="audio/wav"
                        controls
                        className={classes.audio}
                        autoPlay
                    />
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
