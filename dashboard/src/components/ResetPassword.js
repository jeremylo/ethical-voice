import { IconButton, InputAdornment, InputLabel, Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import LockIcon from '@material-ui/icons/Lock';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import TopBar from './layout/TopBar';
import { isValidPassword } from './utils';


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

export default function ResetPassword() {
    const classes = useStyles();
    const auth = useAuth();
    const history = useHistory();
    const { sroid, token } = useParams();

    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "error",
        message: "Password reset request rejected — please double-check your email and try again."
    });
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.toLowerCase());
    };

    const passwordInvalid = !isValidPassword(password);
    const passwordAttributes = (password && passwordInvalid) ? {
        error: true,
        helperText: "Please enter a valid password that is at least 10 characters in length."
    } : {};

    // Form submission
    const handleSubmit = () => {
        setSubmitted(true);
        auth.resetPassword(sroid, token, password)
            .then((successful) => {
                if (successful) {
                    history.push('/login/successful-password-reset');
                } else {
                    setSnackbarProperties({
                        severity: "error",
                        message: "Password reset failed — your password reset link is invalid."
                    });
                    setSubmitted(false);
                }
                setOpen(true);
            })
            .catch(() => {
                setSnackbarProperties({
                    severity: "error",
                    message: "You cannot reset your password at this time — please try later when you have a stable internet connection."
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
                    Reset your password
                </Typography>
                <form className={classes.form}>
                    <InputLabel>
                        Please provide a new password for your account below.
                    </InputLabel>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="password"
                        value={password}
                        onChange={handlePasswordChange}
                        {...passwordAttributes}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={_ => setShowPassword(!showPassword)}
                                    onMouseDown={e => e.preventDefault()}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>,
                        }}
                    />
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!password || passwordInvalid || submitted}
                        onClick={handleSubmit}
                    >
                        Reset password
                    </Button>
                </form>
            </div>

            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarProperties.severity}>{snackbarProperties.message}</Alert>
            </Snackbar>
        </Container>
    </>;
}
