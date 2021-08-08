import { Container, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getAllResults } from "../persistence/db";
import getTests, { defaultTests } from "../persistence/tests";
import ResultsCard from "./analysis/completion/ResultsCard";

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
    const [loaded, setLoaded] = useState(false);
    const [results, setResults] = useState([]);
    const [tests, setTests] = useState(defaultTests);
    const sortByDesc = true;

    const handleNewResults = (data) => {
        setResults(data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }));
    };

    useEffect(() => {
        getTests().then(setTests);
    }, [setTests])

    useEffect(() => {
        getAllResults().then(res => {
            handleNewResults(res);
            setLoaded(true);
            console.log(res);
        });
    }, [setLoaded]);

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Results</Typography>
            </Container>

            <Container maxWidth="sm">
                {loaded && (results.length > 0 ? <>
                    {results.map((r, i) => <ResultsCard results={r} tests={tests} key={i} />)}
                </> : <Typography>
                    You have no results to display as of yet.
                </Typography>)}
            </Container>
        </div >
    )
}
