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
        ...[...Array(50).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(0, 9), getRandomInt(0, 27)), y: getRandomInt(250, 300)
        })),
        ...[...Array(20).keys()].map(_ => ({
            x: new Date(2021, getRandomInt(9, 12), getRandomInt(0, 27)), y: getRandomInt(50, 100)
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
            </Container>
        </div >
    )
}
