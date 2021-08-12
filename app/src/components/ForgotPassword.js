import { Grid, InputLabel, Link as MuiLink, Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import TopBar from './layout/TopBar';
import { isValidEmail } from './utils';


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
        marginTop: theme.spacing(4),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ForgotPassword() {
    const classes = useStyles();
    const auth = useAuth();

    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "error",
        message: "Password reset request rejected — please double-check your email and try again."
    });
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value.toLowerCase());
    };

    const emailInvalid = !isValidEmail(email);
    const emailAttributes = (email && emailInvalid) ? {
        error: true,
        helperText: "Please enter a valid email."
    } : {};

    // Form submission
    const handleSubmit = () => {
        setSubmitted(true);
        auth.requestPasswordReset(email)
            .then((successful) => {
                if (successful) {
                    setSnackbarProperties({
                        severity: "success",
                        message: "Password reset request accepted — please click the reset link sent to your email to proceed."
                    });
                } else {
                    setSnackbarProperties({
                        severity: "error",
                        message: "Password reset request rejected — please double-check your email and try again."
                    });
                    setSubmitted(false);
                }
                setOpen(true);
            })
            .catch(() => {
                setSnackbarProperties({
                    severity: "error",
                    message: "Your password reset request could not be lodged at this time."
                });
                setOpen(true);
            });
    };

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return <>
        <TopBar />
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Account recovery
                </Typography>
                <form className={classes.form}>
                    <InputLabel>
                        To request a password reset, please provide your email address below.
                    </InputLabel>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="forgot-password-email"
                        label="Email address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={handleEmailChange}
                        {...emailAttributes}
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!email || emailInvalid || submitted}
                        onClick={handleSubmit}
                    >
                        Request password reset
                    </Button>
                    <Grid container>
                        <Grid item>
                            <MuiLink
                                variant="body2"
                                component={Link}
                                to="/login"
                            >Remembered your password? Login</MuiLink>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarProperties.severity}>{snackbarProperties.message}</Alert>
            </Snackbar>
        </Container>
    </>;
}
