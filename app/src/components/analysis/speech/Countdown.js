import { CircularProgress, Fab } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Mic } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import clsx from 'clsx';
import { React, useEffect, useState } from 'react';
import { useTimer } from 'react-use-precision-timer';



const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '1.75rem',
        marginBottom: '1.75rem',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonFinished: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
}));


export default function Countdown({ running, duration, handleStart, handleStop, disabled }) {
    const classes = useStyles();

    const [progress, setProgress] = useState(duration);
    const [finished, setFinished] = useState(false);
    const handleTick = () => {
        if (progress > 0) {
            setProgress(progress - 1);
        }
    };

    const timer = useTimer({ delay: 1000, callback: () => handleTick(), startImmediately: false });

    useEffect(() => {
        if (running && !timer.isRunning()) {
            timer.start();
        }

        if (progress <= 0 && timer.isRunning() && !finished) {
            timer.stop();
            setFinished(true);
            handleStop();
        }
    }, [finished, handleStop, progress, running, timer]);

    const handleClick = () => {
        if (!running && !finished) {
            handleStart();
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={classes.root}
        >
            <div className={classes.wrapper}>
                <Fab
                    aria-label="start"
                    color="primary"
                    onClick={handleClick}
                    className={clsx({ [classes.buttonFinished]: finished })}
                    disabled={disabled}
                >
                    {finished ? <CheckIcon /> : (
                        running ? progress : <Mic />
                    )}
                </Fab>
                {running &&
                    <CircularProgress
                        size={68}
                        className={classes.fabProgress}
                        variant="determinate"
                        value={100 * progress / duration}
                    />}
                {finished &&
                    <CircularProgress
                        size={68}
                        className={classes.fabProgress}
                        variant="indeterminate"
                    />}
            </div>
        </Box>
    );
}
