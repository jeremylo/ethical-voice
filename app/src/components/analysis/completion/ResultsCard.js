import { Card, CardHeader, Divider, Typography } from "@material-ui/core";
import MicIcon from '@material-ui/icons/Mic';
import { sputumColours } from "../Sputum";

export default function ResultsCard({ results, tests, test, duration }) {
    console.log(results);
    return (
        <Card variant="outlined">
            <CardHeader
                avatar={<MicIcon />}
                title={`${tests[test].title} (${duration}s)`}
                subheader={new Date().toLocaleDateString()}
            />
            <Divider />
            <div style={{ padding: '16px' }}>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Syllables per minute</strong>: {results['speech.syllablesPerMinute']} <br />
                    {results.sputum && <><strong>Sputum colour</strong>: {sputumColours.find(x => x.value === results.sputum).name.toLowerCase()}<br /></>}
                    {results.wellbeing && <><strong>Wellbeing</strong>: {results.wellbeing} / 10<br /></>}
                    {results.dyspnoea && <><strong>MRC dyspnoea score</strong>: {results.dyspnoea}<br /></>}
                </Typography>
            </div>
        </Card>
    );
}
