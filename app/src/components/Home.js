import { Container, makeStyles, Typography } from "@material-ui/core";
import RateChart from "./visualisation/RateChart";


// Get dummy data for the graphs
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const generateFakeGoodDatum = () => ({
    speech: {
        syllablesPerMinute: getRandomInt(270, 320)
    },
    sputum: getRandomInt(1, 3),
    wellbeing: getRandomInt(7, 11),
    dyspnoea: getRandomInt(1, 3),
    createdAt: new Date(2021, getRandomInt(0, 12), getRandomInt(0, 27))
});

const generateFakeBadDatum = () => ({
    speech: {
        syllablesPerMinute: getRandomInt(90, 120)
    },
    sputum: getRandomInt(4, 6),
    wellbeing: getRandomInt(2, 5),
    dyspnoea: getRandomInt(4, 6),
    createdAt: new Date(2021, getRandomInt(8, 10), getRandomInt(0, 27))
});


const data = [
    ...[...Array(20).keys()].map(generateFakeGoodDatum),
    ...[...Array(1).keys()].map(generateFakeBadDatum),
].sort((a, b) => a.createdAt - b.createdAt);
// End getting dummy data


const useStyles = makeStyles((theme) => ({
    header: {
        paddingTop: "1rem",
        paddingBottom: "0.5rem",
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));


export default function Home() {
    const classes = useStyles();

    const syllableRateData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.speech.syllablesPerMinute
    }));

    const sputumColourData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.sputum
    }));

    const wellbeingData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.wellbeing
    }));

    const dyspnoeaData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.dyspnoea
    }));

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Overview</Typography>
            </Container>

            <Container maxWidth="sm">
                <RateChart
                    title="Speaking rate (syllables per minute)"
                    data={syllableRateData}
                    showLowerStddev showLower3Stddev
                />
                <br />
                <RateChart
                    title="Sputum colour"
                    data={sputumColourData}
                    domain={{ y: [1, 5] }}
                    showUpperStddev
                />
                <br />
                <RateChart
                    title="Wellbeing"
                    data={wellbeingData}
                    domain={{ y: [1, 10] }}
                    showLowerStddev
                />
                <br />
                <RateChart
                    title="MRC dyspnoea scale"
                    data={dyspnoeaData}
                    domain={{ y: [1, 5] }}
                    showUpperStddev
                />
                <br />
            </Container>
        </div >
    )
}
