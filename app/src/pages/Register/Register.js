import { Grid, InputLabel, Link as MuiLink, Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AccountCircleRounded } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import TopBar from '../../components/Layout/TopBar';
import { isValidEmail, isValidReferenceId } from '../../utils/validation';


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

export default function Register() {
    const classes = useStyles();
    const auth = useAuth();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "error",
        message: "Registration failed — please double-check your details and try again."
    });
    const [refId, setRefId] = useState(params.refId ?? '');
    const [email, setEmail] = useState('');

    const handleRefIdChange = (event) => {
        let val = event.target.value.toLowerCase();
        if (/^[0-9]*$/.test(val)) {
            setRefId(val);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value.toLowerCase());
    };

    const refIdInvalid = !isValidReferenceId(refId);
    const refIdAttributes = (refId && refIdInvalid) ? {
        error: true,
        helperText: "Please enter the numeric reference ID provided by your clinician."
    } : {};

    const emailInvalid = !isValidEmail(email);
    const emailAttributes = (email && emailInvalid) ? {
        error: true,
        helperText: "Please enter a valid email."
    } : {};

    // Form submission
    const handleSubmit = () => {
        setSubmitted(true);
        auth.register(refId, email)
            .then((successful) => {
                if (successful) {
                    setSnackbarProperties({
                        severity: "success",
                        message: "Registration successful — please click the confirmation link sent to your email."
                    });
                } else {
                    setSnackbarProperties({
                        severity: "error",
                        message: "Registration failed — please double-check your details and try again."
                    });
                    setSubmitted(false);
                }
                setOpen(true);
            })
            .catch(() => {
                setSnackbarProperties({
                    severity: "error",
                    message: "Registration failed — your details could not be verified at this time."
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

    return (<>
        <TopBar />
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircleRounded />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form className={classes.form}>
                    <InputLabel>
                        To register, you need the reference ID provided when you were referred to this service.
                    </InputLabel>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="registration-refid"
                        label="Reference ID"
                        name="refid"
                        autoComplete="off"
                        autoFocus
                        value={refId}
                        onChange={handleRefIdChange}
                        inputProps={{ pattern: '[0-9]*', maxLength: 16 }}
                        {...refIdAttributes}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="registration-email"
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
                        disabled={!email || !refId || emailInvalid || refIdInvalid || submitted}
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item>
                            <MuiLink
                                variant="body2"
                                component={Link}
                                to="/login"
                            >Already have an account? Login</MuiLink>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarProperties.severity}>{snackbarProperties.message}</Alert>
            </Snackbar>
        </Container>
    </>
    );
}
