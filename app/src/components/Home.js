import { Container, makeStyles, Typography } from "@material-ui/core";
import RateChart from "./visualisation/RateChart";


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

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    const syllableRateData = [
        ...[...Array(78).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(0, 9), getRandomInt(0, 27)), y: getRandomInt(270, 320)
        })),
        ...[...Array(26).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(9, 12), getRandomInt(0, 27)), y: getRandomInt(90, 120)
        })),
    ].sort((a, b) => a.x - b.x);

    // const syllableRateData = [
    //     { x: new Date(2021, 5, 14), y: 288 },
    //     { x: new Date(2021, 5, 21), y: 228 },
    //     { x: new Date(2021, 5, 28), y: 270 },
    //     { x: new Date(2021, 6, 5), y: 330 },
    //     { x: new Date(2021, 6, 9), y: 348 },
    //     { x: new Date(2021, 6, 12), y: 294 },
    //     { x: new Date(2021, 6, 17), y: 186 },
    //     { x: new Date(2021, 6, 19), y: 166 },
    //     { x: new Date(2021, 6, 24), y: 234 },
    //     { x: new Date(2021, 6, 26), y: 222 },
    // ];

    const sputumColourData = [
        ...[...Array(30).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(0, 9), getRandomInt(0, 27)), y: getRandomInt(1, 3)
        })),
        ...[...Array(30).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(9, 12), getRandomInt(0, 27)), y: getRandomInt(4, 6)
        })),
    ].sort((a, b) => a.x - b.x);

    const wellbeingData = [
        ...[...Array(30).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(0, 9), getRandomInt(0, 27)), y: getRandomInt(7, 11)
        })),
        ...[...Array(30).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(9, 12), getRandomInt(0, 27)), y: getRandomInt(2, 5)
        })),
    ].sort((a, b) => a.x - b.x);

    const dyspnoeaData = [
        ...[...Array(30).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(0, 9), getRandomInt(0, 27)), y: getRandomInt(1, 3)
        })),
        ...[...Array(10).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(9, 12), getRandomInt(0, 27)), y: getRandomInt(4, 6)
        })),
    ].sort((a, b) => a.x - b.x);

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Overview</Typography>
            </Container>

            <Container maxWidth="sm">
                <RateChart
                    title="Speaking rate (syllables per minute)"
                    data={syllableRateData}
                    showThreeStandardDeviations={true} />
                <br />
                <RateChart
                    title="Sputum colour"
                    data={sputumColourData}
                    showThreeStandardDeviations={false}
                    domain={{ y: [1, 5] }}
                />
                <br />
                <RateChart
                    title="Wellbeing"
                    data={wellbeingData}
                    showThreeStandardDeviations={false}
                    domain={{ y: [1, 10] }}
                />
                <br />
                <RateChart
                    title="MRC dyspnoea scale"
                    data={dyspnoeaData}
                    showThreeStandardDeviations={false}
                    domain={{ y: [1, 5] }}
                />
                <br />
            </Container>
        </div >
    )
}
