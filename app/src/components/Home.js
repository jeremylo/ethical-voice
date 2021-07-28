import { Container, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import SpeakingRateChart from "./visualisation/SpeakingRateChart";


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

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Overview</Typography>
            </Container>

            <Container maxWidth="sm">
                <SpeakingRateChart zoomDomain={zoomDomain} setZoomDomain={setZoomDomain} />
            </Container>
        </div >
    )
}
