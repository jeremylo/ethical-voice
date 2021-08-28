import { Paper, Typography } from "@material-ui/core";
import { useAuth } from '../../auth/use-auth';
import ResultsCard from "../../components/ResultsCard/ResultsCard";
import ResultsSubmitter from "./completion/ResultsSubmitter";


export default function Completion({ handleSubmission, results, tests }) {
    const auth = useAuth();
    const sharingEnabled = auth.user.sharing ?? false;
    const resultsCard = <ResultsCard
        results={results}
        tests={tests}
    />;

    return (
        <Paper square elevation={0}>
            <Typography variant="h6">Your submission</Typography>
            {sharingEnabled
                ? <ResultsSubmitter
                    resultsCard={resultsCard}
                    submissionInstruction="When you press the button, your submission will be saved to this device and shared with your senior responsible officer."
                    submissionButtonText="Save & share"
                    submitAudioText="Share & retain the speech recording"
                    onSubmit={async (submitAudio) => handleSubmission(sharingEnabled, auth.user.refId, submitAudio)}
                />
                : <ResultsSubmitter
                    resultsCard={resultsCard}
                    submissionInstruction="When you press save, your submission will be saved to this device."
                    submissionButtonText="Save"
                    submitAudioText="Retain the speech recording on-device"
                    onSubmit={async (submitAudio) => handleSubmission(sharingEnabled, auth.user.refId, submitAudio)}
                />}
        </Paper >
    )
}
