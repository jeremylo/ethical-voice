import { Container, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
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
    const [zoomDomain, setZoomDomain] = useState({});

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    const syllableRateData = [...Array(10).keys()].map(i => ({
        x: new Date(2021, getRandomInt(0, 11), getRandomInt(0, 27)), y: getRandomInt(220, 340)
    })).sort((a, b) => a.x - b.x);

    /*const syllableRateData = [
        { x: new Date(2021, 5, 14), y: 288 },
        { x: new Date(2021, 5, 21), y: 228 },
        { x: new Date(2021, 5, 28), y: 270 },
        { x: new Date(2021, 6, 5), y: 330 },
        { x: new Date(2021, 6, 9), y: 348 },
        { x: new Date(2021, 6, 12), y: 294 },
        { x: new Date(2021, 6, 17), y: 186 },
        { x: new Date(2021, 6, 19), y: 166 },
        { x: new Date(2021, 6, 24), y: 234 },
        { x: new Date(2021, 6, 26), y: 222 },
    ];*/

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Overview</Typography>
            </Container>

            <Container maxWidth="sm">
                <RateChart
                    title="Speaking rate (syllables per minute)"
                    data={syllableRateData}
                    zoomDomain={zoomDomain}
                    setZoomDomain={setZoomDomain}
                    showThreeStandardDeviations />
            </Container>
        </div >
    )
}
