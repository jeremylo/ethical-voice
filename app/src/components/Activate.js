import { IconButton, InputAdornment, InputLabel, Snackbar, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AccountCircleRounded, Visibility, VisibilityOff } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import TopBar from './layout/TopBar';
import { isValidPassword, isValidReferenceId } from './utils';


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

export default function Activate() {
    const classes = useStyles();
    const auth = useAuth();
    const history = useHistory();
    const { refId, token } = useParams();

    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isValidReferenceId(refId)) {
        return <>
            <TopBar />
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircleRounded />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Activate your account
                    </Typography>
                    <br /><br />
                    <Typography style={{ textAlign: 'center' }}>
                        Oh no! It seems that you clicked a bad link.
                    </Typography>
                </div>
            </Container>
        </>;
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.toLowerCase());
    };

    const passwordInvalid = !isValidPassword(password);
    const passwordAttributes = (password && passwordInvalid) ? {
        error: true,
        helperText: "Please enter a valid password that is at least 10 characters in length."
    } : {};

    // Form submission
    const handleSubmission = () => {
        setSubmitted(true);
        auth.register(refId, token, password)
            .then((successful) => {
                if (successful) {
                    history.push('/login/successful_activation');
                } else {
                    setOpen(true);
                }
            })
            .catch(() => {
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
                    Activate your account
                </Typography>
                <form className={classes.form}>
                    <InputLabel>
                        To finish setting up your account, please create a password.
                    </InputLabel>
                    <br />

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
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!password || passwordInvalid || submitted}
                        onClick={handleSubmission}
                    >
                        Activate your account
                    </Button>
                </form>
            </div>

            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Registration failed — please double-check your details and try again.
                </Alert>
            </Snackbar>
        </Container>
    </>
    );
}
