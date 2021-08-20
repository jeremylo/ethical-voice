import Grid from '@material-ui/core/Grid';
import ComparisonChart from '../visualisation/ComparisonChart';

export default function AggregateSubmissionGraphs({ submissions }) {
    const wordRateData = [];
    const sputumColourData = [];
    const wellbeingData = [];
    const dyspnoeaData = [];

    for (const submission of submissions) {
        if (!('speech.syllablesPerMinute' in submission.metadata)) continue;

        const y = +submission.metadata['speech.syllablesPerMinute'];

        if (submission.metadata['speech.wordsPerMinute']) {
            wordRateData.push({
                x: +submission.metadata['speech.wordsPerMinute'], y
            });
        }

        if (submission.metadata.sputum) {
            sputumColourData.push({
                x: +submission.metadata.sputum, y
            });
        }

        if (submission.metadata.wellbeing) {
            wellbeingData.push({
                x: +submission.metadata.wellbeing, y
            });
        }

        if (submission.metadata.dyspnoea) {
            dyspnoeaData.push({
                x: +submission.metadata.dyspnoea, y
            });
        }
    }

    return <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item>
            <ComparisonChart
                title="Sputum colour vs syllable rate"
                domain={{ x: [1, 5] }}
                data={sputumColourData}
            />
        </Grid>
        <Grid item>
            <ComparisonChart
                title="Wellbeing vs syllable rate"
                data={wellbeingData}
            />
        </Grid>
        <Grid item>
            <ComparisonChart
                title="Wellbeing vs syllable rate"
                domain={{ x: [1, 10] }}
                data={dyspnoeaData}
            />
        </Grid>
        <Grid item>
            <ComparisonChart
                title="Word rate vs syllable rate"
                data={wordRateData}
            />
        </Grid>
    </Grid>;

}
