import { Card, CardHeader, Divider, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MicIcon from '@material-ui/icons/Mic';
import MicNoneIcon from '@material-ui/icons/MicNone';
import { useState } from "react";
import sputumColours from "../../data/sputumColours";
import PlayAudioDialog from "./PlayAudioDialog";


const useStyles = makeStyles((theme) => ({
    resultsCard: {
        marginBottom: '1rem'
    },
    avatarButton: {
        padding: '0'
    }
}));

export default function ResultsCard({ results, tests, noAudio }) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const avatar = noAudio ? <MicNoneIcon /> : (
        !!results.audio ? <IconButton
            color="inherit"
            className={classes.avatarButton}
            onClick={_ => setOpen(true)}
        >
            <MicIcon />
        </IconButton> : <MicIcon />
    );

    return <>
        <Card variant="outlined" className={classes.resultsCard}>
            <CardHeader
                avatar={avatar}
                action={results.shared ?
                    <IconButton>
                        <Tooltip title="Shared">
                            <CheckCircleIcon />
                        </Tooltip>
                    </IconButton>
                    : null}
                title={`${(tests[results.testId] ?? { title: 'Speaking test' }).title} (${results["speech.duration"]}s)`}
                subheader={new Date(results.createdAt).toLocaleString()}
            />
            <Divider />
            <div style={{ padding: '16px' }}>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Syllables per minute</strong>: {results['speech.syllablesPerMinute']} <br />
                    {results['speech.wordsPerMinute'] && <><strong>Words per minute</strong>: {results['speech.wordsPerMinute']} <br /></>}
                    {results.sputum && <><strong>Sputum colour</strong>: {sputumColours.find(x => x.value === results.sputum).name.toLowerCase()}<br /></>}
                    {results.wellbeing && <><strong>Wellbeing</strong>: {results.wellbeing} / 10<br /></>}
                    {results.dyspnoea && <><strong>MRC dyspnoea score</strong>: {results.dyspnoea}<br /></>}
                </Typography>
            </div>
        </Card>
        {(!noAudio && !!results.audio) && <PlayAudioDialog open={open} onClose={_ => setOpen(false)} audio={results.audio} />}
    </>;
}
