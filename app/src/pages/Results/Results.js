import { Container, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/use-auth";
import ResultsCard from "../../components/ResultsCard/ResultsCard";
import { getAllResults } from "../../data/db";
import getTests, { defaultTests } from "../../data/tests";

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


export default function Results() {
    const classes = useStyles();
    const auth = useAuth();
    const [loaded, setLoaded] = useState(false);
    const [results, setResults] = useState([]);
    const [tests, setTests] = useState(defaultTests);
    const newestFirst = true;

    useEffect(() => {
        getTests().then(setTests);
    }, [setTests])

    useEffect(() => {
        const handleNewResults = (data) => {
            setResults(data.sort((a, b) => {
                return (new Date(b.createdAt) - new Date(a.createdAt)) * (newestFirst ? 1 : -1);
            }));
        };

        getAllResults(auth.user.refId).then(res => {
            handleNewResults(res);
            setLoaded(true);
        });
    }, [newestFirst, auth.user]);

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Results</Typography>
            </Container>

            <Container maxWidth="sm">
                {loaded && (results.length > 0 ? <>
                    {results.map((r, i) => <ResultsCard results={r} tests={tests} key={i} noAudio={!r.audio} />)}
                </> : <Typography>
                    You have no results to display as of yet.
                </Typography>)}
            </Container>
        </div >
    )
}
