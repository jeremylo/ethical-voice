import { Button, Container, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import TopBar from './layout/TopBar';


const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        marginTop: '6rem'
    }
});


export default function Error404() {
    const classes = useStyles();

    return (
        <>
            <TopBar loggedIn={false} />
            <Container component="main" maxWidth="xs" className={classes.container}>
                <Typography variant="h1">404</Typography>
                <Typography variant="body1">
                    <br />
                    It seems that you're in the wrong place.
                    <br /><br />
                    <Button variant="contained" color="primary" component={Link} to="/">
                        Return to the dashboard
                    </Button>
                </Typography>
            </Container>
        </>
    );
}
