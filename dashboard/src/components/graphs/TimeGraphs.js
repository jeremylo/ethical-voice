import { Grid, Typography } from "@material-ui/core";
import RateChart from "./visualisation/RateChart";



export default function TimeGraphs({ submissions }) {
    const syllableRateData = [];
    const wordRateData = [];
    const sputumColourData = [];
    const wellbeingData = [];
    const dyspnoeaData = [];

    for (const submission of submissions) {
        const x = new Date(submission.created_at).getTime();

        if (submission.metadata['speech.syllablesPerMinute']) {
            syllableRateData.push({
                x, y: +submission.metadata['speech.syllablesPerMinute']
            });
        }

        if (submission.metadata['speech.wordsPerMinute']) {
            wordRateData.push({
                x, y: +submission.metadata['speech.wordsPerMinute']
            });
        }

        if (submission.metadata.sputum) {
            sputumColourData.push({
                x, y: +submission.metadata.sputum
            });
        }

        if (submission.metadata.wellbeing) {
            wellbeingData.push({
                x, y: +submission.metadata.wellbeing
            });
        }

        if (submission.metadata.dyspnoea) {
            dyspnoeaData.push({
                x, y: +submission.metadata.dyspnoea
            });
        }
    }

    console.log(syllableRateData);

    return <>
        <Typography variant="h5">Time series graphs</Typography>
        <br />
        <Grid container justifyContent="center" alignItems="center" spacing={3}>
            {syllableRateData.length > 0 && <Grid item>
                <RateChart
                    title="Speaking rate (syllables per minute)"
                    data={syllableRateData}
                    showLowerStddev showLower3Stddev
                />
            </Grid>}
            {wordRateData.length > 0 && <Grid item>
                <RateChart
                    title="Speaking rate (words per minute)"
                    data={wordRateData}
                    showLowerStddev showLower3Stddev
                />
            </Grid>}
            {sputumColourData.length > 0 && <Grid item>
                <RateChart
                    title="Sputum colour"
                    data={sputumColourData}
                    domain={{ y: [1, 5] }}
                    showUpperStddev
                />
            </Grid>}
            {wellbeingData.length > 0 && <Grid item>
                <RateChart
                    title="Wellbeing"
                    data={wellbeingData}
                    domain={{ y: [1, 10] }}
                    showLowerStddev
                />
            </Grid>}
            {dyspnoeaData.length > 0 && <Grid item>
                <RateChart
                    title="MRC dyspnoea scale"
                    data={dyspnoeaData}
                    domain={{ y: [1, 5] }}
                    showUpperStddev
                />
            </Grid>}
        </Grid>
    </>;
}
