import { Paper, Typography } from "@material-ui/core";
import { useAuth } from '../../auth/use-auth';
import ResultsCard from "./completion/ResultsCard";
import ResultsSubmitter from "./completion/ResultsSubmitter";

export default function Completion({ handleSubmission, results, tests, test, duration }) {
    const auth = useAuth();
    const sharingEnabled = auth.user.sharing ?? false;
    const resultsCard = <ResultsCard
        results={results}
        tests={tests}
        test={test}
        duration={duration}
    />;

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Your submission</Typography>
            {sharingEnabled
                ? <ResultsSubmitter
                    resultsCard={resultsCard}
                    submissionInstruction="When you press the button, your submission will be saved to this device and shared with your senior responsible officer."
                    submissionButtonText="Save & share"
                    savingSuccessfulMessage="Your submission was successfully saved and shared with your senior responsible officer."
                    savingUnsuccessfulMessage="Your submission could not be saved and shared with your senior responsible officer."
                    onSubmit={async _ => handleSubmission(sharingEnabled)}
                />
                : <ResultsSubmitter
                    resultsCard={resultsCard}
                    submissionInstruction="When you press save, your submission will be saved to this device."
                    submissionButtonText="Save"
                    savingSuccessfulMessage="Your submission was successfully saved to your device."
                    savingUnsuccessfulMessage="Your submission could not be successfully saved to your device."
                    onSubmit={async _ => handleSubmission(sharingEnabled)}
                />}
        </Paper >
    )
}