import { Link as MuiLink, Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MuiAlert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import TopBar from '../../components/Layout/TopBar';
import { isValidEmail } from '../../utils/validation';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.success.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();
    const { status } = useParams();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value.toLowerCase());
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.toLowerCase());
    };

    const isInvalidEmail = !isValidEmail(email);
    const emailAttributes = (email && isInvalidEmail) ? {
        error: true,
        helperText: "Please enter a valid email."
    } : {};

    const handleLogin = async () => {
        const user = await auth.login(email, password);

        if (user) {
            const { from } = location.state || { from: { pathname: "/" } };
            history.replace(from);
        } else {
            setOpen(true);
        }
    };

    const handleAnonymousLogin = async () => {
        auth.loginAnonymously();

        const { from } = location.state || { from: { pathname: "/" } };
        history.replace(from);
    };

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <TopBar />
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    {status === 'successful-activation' && <><br /><MuiAlert severity="success">
                        Your account has been activated successfully, so you may now log in.
                    </MuiAlert></>}
                    {status === 'successful-password-reset' && <><br /><MuiAlert severity="success">
                        Your password has been reset successfully. You may now log in with your new password.
                    </MuiAlert></>}
                    <form className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleEmailChange}
                            {...emailAttributes}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!email || !password || !isValidEmail}
                            onClick={handleLogin}
                        >
                            Log in
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <MuiLink
                                    variant="body2"
                                    component={Link}
                                    to="/request-password-reset"
                                >Forgot password?</MuiLink>
                            </Grid>
                            <Grid item>
                                <MuiLink
                                    variant="body2"
                                    component={Link}
                                    to="/register"
                                >Don't have an account? Register</MuiLink>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            {/* <Grid item xs>
                                <MuiLink
                                    variant="body2"
                                    component={Link}
                                    to="/request-password-reset"
                                >Forgot password?</MuiLink>
                            </Grid> */}
                            <Grid item>
                                <MuiLink
                                    variant="body2"
                                    onClick={handleAnonymousLogin}
                                >Haven't been referred to the service? Log in anonymously for personal use only</MuiLink>
                            </Grid>
                        </Grid>
                    </form>

                    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                            You could not be logged in due to an incorrect email or password. Please double-check and try again.
                        </Alert>
                    </Snackbar>
                </div>
            </Container>
        </>
    );
}
