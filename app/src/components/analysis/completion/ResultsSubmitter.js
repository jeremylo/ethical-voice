import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import { SUBMISSION_MESSAGES } from "../submission_statuses";


export default function ResultsSubmitter({
    resultsCard,
    onSubmit,
    submissionInstruction,
    submissionButtonText,
    submitAudioText
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [submitAudio, setSubmitAudio] = useState(true);
    const [status, setStatus] = useState(null);

    const handleSubmitAudioChanged = (event) => {
        setSubmitAudio(!submitAudio);
    };

    if (saving) {
        if (saved && status) {
            return <>
                <Alert severity={SUBMISSION_MESSAGES[status].severity} style={{ marginBottom: '1rem' }}>{SUBMISSION_MESSAGES[status].message}</Alert>
                {resultsCard}
            </>;
        }

        return <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ padding: '6rem 2rem 2rem 2rem' }}
        >
            <CircularProgress size={68} variant="indeterminate" />
        </Box>;
    }

    return (<>
        <Typography>{submissionInstruction}</Typography>
        <br />
        {resultsCard}
        <Box>
            <FormControlLabel
                control={<Checkbox checked={submitAudio} onChange={handleSubmitAudioChanged} name="submit-audio-checkbox" />}
                label={submitAudioText}
            />
        </Box>
        <Box textAlign="center">
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                    setSaving(true);
                    onSubmit(submitAudio).then(submissionStatus => {
                        setStatus(submissionStatus);
                        setSaved(true);
                    });
                }}
                endIcon={<KeyboardArrowRightIcon />}
            >{submissionButtonText}</Button>
        </Box>
    </>);
}
