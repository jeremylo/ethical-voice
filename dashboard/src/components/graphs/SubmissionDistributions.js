import Grid from '@material-ui/core/Grid';
import Histogram from '../visualisation/Histogram';

export default function SubmissionDistributions({ submissions }) {
    const syllableRateData = [];
    const wordRateData = [];
    const sputumColourData = [];
    const wellbeingData = [];
    const dyspnoeaData = [];

    for (const submission of submissions) {
        if (submission.metadata['speech.syllablesPerMinute']) {
            syllableRateData.push(+submission.metadata['speech.syllablesPerMinute']);
        }

        if (submission.metadata['speech.wordsPerMinute']) {
            wordRateData.push(+submission.metadata['speech.wordsPerMinute']);
        }

        if (submission.metadata.sputum) {
            sputumColourData.push(+submission.metadata.sputum);
        }

        if (submission.metadata.wellbeing) {
            wellbeingData.push(+submission.metadata.wellbeing);
        }

        if (submission.metadata.dyspnoea) {
            dyspnoeaData.push(+submission.metadata.dyspnoea);
        }
    }

    console.log(syllableRateData)

    return <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item>
            <Histogram
                title="Syllable rate (syllables per minute)"
                data={syllableRateData}
            />
        </Grid>
        <Grid item>
            <Histogram
                title="Word rate (words per minute)"
                data={wordRateData}
            />
        </Grid>
        <Grid item>
            <Histogram
                title="Sputum colour"
                domain={{ x: [1, 5] }}
                data={sputumColourData}
            />
        </Grid>
        <Grid item>
            <Histogram
                title="Wellbeing"
                data={wellbeingData}
            />
        </Grid>
        <Grid item>
            <Histogram
                title="MRC dypsnoea score"
                domain={{ x: [1, 10] }}
                data={dyspnoeaData}
            />
        </Grid>
    </Grid>;

}
