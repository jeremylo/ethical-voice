import { Grid, InputLabel, Link as MuiLink } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AccountCircleRounded } from '@material-ui/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Copyright from './layout/Copyright';
import TopBar from './layout/TopBar';
import { isValidEmail, isValidPassword, isValidReferenceId } from './utils';


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

    const [refId, setRefId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRefIdChange = (event) => {
        let val = event.target.value.toLowerCase();
        if (/^[0-9]*$/.test(val)) {
            setRefId(val);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value.toLowerCase());
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.toLowerCase());
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

    const passwordInvalid = !isValidPassword(password);
    const passwordAttributes = (password && passwordInvalid) ? {
        error: true,
        helperText: "Please enter a valid password that is at least 10 characters in length."
    } : {};

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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="registration-password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        {...passwordAttributes}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!email || !password || !refId || emailInvalid || refIdInvalid}
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
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    </>
    );
}
