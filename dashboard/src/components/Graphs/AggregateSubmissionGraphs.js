import Grid from '@material-ui/core/Grid';
import ComparisonChart from './visualisation/ComparisonChart';

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
        {sputumColourData.length > 0 && <Grid item>
            <ComparisonChart
                title="Sputum colour vs syllable rate"
                domain={{ x: [1, 5] }}
                data={sputumColourData}
                xLabel="Sputum colour"
                yLabel="Syllables per minute"
            />
        </Grid>}
        {wellbeingData.length > 0 && <Grid item>
            <ComparisonChart
                title="Wellbeing vs syllable rate"
                data={wellbeingData}
                xLabel="Wellbeing score"
                yLabel="Syllables per minute"
            />
        </Grid>}
        {dyspnoeaData.length > 0 && <Grid item>
            <ComparisonChart
                title="MRC dyspnoea score vs syllable rate"
                domain={{ x: [1, 10] }}
                data={dyspnoeaData}
                xLabel="MRC dyspnoea score"
                yLabel="Syllables per minute"
            />
        </Grid>}
        {wordRateData.length > 0 && <Grid item>
            <ComparisonChart
                title="Word rate vs syllable rate"
                data={wordRateData}
                xLabel="Words per minute"
                yLabel="Syllables per minute"
            />
        </Grid>}
    </Grid>;

}
