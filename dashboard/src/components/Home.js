import { Container, makeStyles, Typography } from "@material-ui/core";
import { useAuth } from "../auth/use-auth";


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
    console.log(auth.sro);

    return <div className={classes.root}>
        <Container maxWidth="sm" className={classes.header}>
            <Typography variant="h5">Home</Typography>
        </Container>
        <Container maxWidth="sm">
            <Typography>
                Hiya!
            </Typography>
        </Container>
    </div>;
}
