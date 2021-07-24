import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-use-precision-timer';

export default function Countdown({ running, duration, handleStop }) {
    const [progress, setProgress] = useState(duration);
    const handleTick = () => {
        if (progress > 0) {
            setProgress(progress - 1);
        }
    };

    const timer = useTimer({ delay: 1000, callback: () => handleTick(), startImmediately: false });

    useEffect(() => {
        console.log([progress, running, timer.isRunning()]);
        if (running && !timer.isRunning()) {
            timer.start();
        }

        if (progress <= 0 && timer.isRunning()) {
            timer.stop();
            handleStop();
        }
    }, [handleStop, progress, running, timer]);

    return (
        <>
            <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" value={100 * progress / duration} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color="textSecondary">{progress}s</Typography>
                </Box>
            </Box>
        </>
    );
}
