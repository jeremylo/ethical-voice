import { Container, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/use-auth";
import { getAllResults } from "../persistence/db";
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
    const auth = useAuth();
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        getAllResults(auth.user.refId).then(res => {
            setData(res);
            setLoaded(true);
        });
    }, [setLoaded, auth.user]);

    if (!loaded) {
        return <></>;
    }

    if (data.length < 3) {
        return <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Overview</Typography>
            </Container>
            <Container maxWidth="sm">
                <Typography>
                    Results visualisations will appear here once you have at least three submissions.
                </Typography>
            </Container>
        </div>;
    }

    const syllableRateData = data.map(datum => ({
        x: datum.createdAt,
        y: datum['speech.syllablesPerMinute'] ?? null
    })).filter(datum => datum.y !== null);

    const sputumColourData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.sputum ?? null
    })).filter(datum => datum.y !== null);

    const wellbeingData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.wellbeing ?? null
    })).filter(datum => datum.y !== null);

    const dyspnoeaData = data.map(datum => ({
        x: datum.createdAt,
        y: datum.dyspnoea ?? null
    })).filter(datum => datum.y !== null);

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
        </div>
    );
}
