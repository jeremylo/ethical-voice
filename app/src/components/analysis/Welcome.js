import { Box, Button, FormControl, InputLabel, makeStyles, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useState } from "react";
import { useAuth } from '../../auth/use-auth';
import { useMountEffect } from '../utils';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: '96%'
    }
}));

export default function Welcome({ handleNext, tests, selectTest, selectDuration }) {
    const classes = useStyles();
    const auth = useAuth();
    const sharingEnabled = auth.user.sharing ?? false;

    useMountEffect(() => { auth.refresh(); });

    const [test, setTest] = useState('');
    const handleTestChange = (event) => {
        setTest(event.target.value);
    };

    const [duration, setDuration] = useState('');
    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Select a speaking test</Typography>
            <Typography>
                Please select a speaking test and duration for this recording below.
            </Typography>

            <br />

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="speaking-test-select-label">Speaking test</InputLabel>
                <Select
                    labelId="speaking-test-select-label"
                    id="speaking-test-select"
                    value={test}
                    onChange={handleTestChange}
                    label="Speaking test"
                >
                    {Object.keys(tests).map(id => <MenuItem
                        key={id} value={id}
                    >{tests[id].title}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl} disabled={test === ''}>
                <InputLabel id="speaking-duration-select-label">Speaking duration</InputLabel>
                <Select
                    labelId="speaking-duration-select-label"
                    id="speaking-duration-select"
                    value={duration}
                    onChange={handleDurationChange}
                    label="Speaking duration"
                >
                    {test !== '' &&
                        (tests[test].possibleDurations ?? [30]).map(d => <MenuItem key={d} value={d}>{d} seconds</MenuItem>)
                    }
                </Select>
            </FormControl>

            <br />
            <br />

            <Typography>
                {sharingEnabled && <>This submission will be shared with your associated senior responsible officer.</>} When you are in a quiet space and ready, press start.
            </Typography>
            <br />

            <Box textAlign='center'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        selectTest(test);
                        selectDuration(duration);
                        handleNext();
                    }}
                    endIcon={<KeyboardArrowRightIcon />}
                    disabled={test === '' || duration === ''}
                >Start</Button>
            </Box>
        </Paper >
    )
}
