import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Alert } from "@material-ui/lab";
import { useState } from "react";

export default function ResultsSubmitter({
    resultsCard,
    onSubmit,
    submissionInstruction,
    submissionButtonText,
    savingSuccessfulMessage,
    savingUnsuccessfulMessage,
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [success, setSuccess] = useState(false);

    if (saving) {
        if (saved) {
            return <>
                {success
                    ? <Alert severity="success" style={{ margin: '2rem 0' }}>{savingSuccessfulMessage}</Alert>
                    : <Alert severity="error" style={{ margin: '2rem 0' }}>{savingUnsuccessfulMessage}</Alert>}
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
                    onSubmit().then(success => {
                        setSuccess(success);
                        setSaved(true);
                    });
                }}
                endIcon={<KeyboardArrowRightIcon />}
            >{submissionButtonText}</Button>
        </Box>
    </>);
}
