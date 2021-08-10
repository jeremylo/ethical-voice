import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import { SUBMISSION_MESSAGES } from "../submission_statuses";


export default function ResultsSubmitter({
    resultsCard,
    onSubmit,
    submissionInstruction,
    submissionButtonText
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [status, setStatus] = useState(null);

    if (saving) {
        if (saved && status) {
            return <>
                <Alert severity={SUBMISSION_MESSAGES[status].severity} style={{ margin: '2rem 0' }}>{SUBMISSION_MESSAGES[status].message}</Alert>
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
        <Box textAlign="center">
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                    setSaving(true);
                    onSubmit().then(submissionStatus => {
                        setStatus(submissionStatus);
                        setSaved(true);
                    });
                }}
                endIcon={<KeyboardArrowRightIcon />}
            >{submissionButtonText}</Button>
        </Box>
    </>);
}
