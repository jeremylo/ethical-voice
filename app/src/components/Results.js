import { Container, makeStyles, Typography } from "@material-ui/core";


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

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">Results</Typography>
            </Container>

            <Container maxWidth="sm">
                Results page.
            </Container>
        </div >
    )
}
