

import { Container, Divider, List, ListItem, ListItemText, makeStyles, Paper, Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { useAuth } from '../auth/use-auth';
import ChangeEmailDialog from './settings/ChangeEmailDialog';
import ChangeNameDialog from './settings/ChangeNameDialog';
import ChangePasswordDialog from './settings/ChangePasswordDialog';


function SnackbarAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    header: {
        paddingTop: "1rem",
        paddingBottom: "0.5rem",
    },
    about: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    list: {
        paddingBottom: '0'
    }
}));

export default function Settings() {
    const classes = useStyles();
    const auth = useAuth();

    // Snackbar
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "success",
        message: "Success!"
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarOpen = (properties) => {
        setSnackbarOpen(true);
        setSnackbarProperties(properties);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Settings options
    const [open, setOpen] = useState(null);
    const [fullname, setFullname] = useState(auth.sro.name);
    const email = auth.sro.email;

    const handleOpen = (id) => {
        setOpen(id);
    };

    const handleClose = (newValue) => {
        if (newValue !== undefined) {
            switch (open) {
                case 'name':
                    auth.setName(newValue)
                        .then((successful) => {
                            if (successful) {
                                setFullname(newValue);
                                handleSnackbarOpen({
                                    severity: 'success',
                                    message: 'Name changed successfully.'
                                });
                            } else {
                                throw new Error("Bad name.");
                            }
                        })
                        .catch(() => {
                            handleSnackbarOpen({
                                severity: 'error',
                                message: 'Server error — awfully sorry, your name could not be updated. Please try again later!'
                            });
                        })

                    break;

                case 'email':
                    auth.setEmail(newValue)
                        .then((successful) => {
                            if (successful) {
                                handleSnackbarOpen({
                                    severity: 'success',
                                    message: 'A confirmation email has been sent to your new email. Click the link inside within the next hour to effectuate the change.'
                                });
                            } else {
                                throw new Error("Email could not be updated.");
                            }
                        })
                        .catch(() => {
                            handleSnackbarOpen({
                                severity: 'error',
                                message: 'Server error — awfully sorry, we cannot update your email right now.'
                            });
                        })
                    break;

                case 'password':
                    const [oldPassword, newPassword] = newValue;
                    auth.setPassword(oldPassword, newPassword)
                        .then((successful) => {
                            if (successful) {
                                handleSnackbarOpen({
                                    severity: 'success',
                                    message: 'Password changed successfully.'
                                });
                            } else {
                                handleSnackbarOpen({
                                    severity: 'error',
                                    message: 'Incorrect password — change unsuccessful.'
                                });
                            }
                        })
                        .catch(() => {
                            handleSnackbarOpen({
                                severity: 'error',
                                message: 'Server error — awfully sorry, your password could not be updated. Please try again later!'
                            });
                        })
                    break;

                default:
                    break;
            }
        }

        setOpen(null);
    };

    return (
        <div className={classes.root}>
            <Paper>
                <Container className={classes.header}>
                    <Typography variant="h5">
                        Settings
                    </Typography>
                </Container>

                <List className={classes.list}>
                    <Divider />
                    <ListItem divider button>
                        <ListItemText
                            primary="Name"
                            secondary={fullname}
                            aria-haspopup="true"
                            onClick={_ => handleOpen('name')}
                        />
                    </ListItem>
                    <ListItem divider button>
                        <ListItemText
                            primary="Email"
                            secondary={email}
                            aria-haspopup="true"
                            onClick={_ => handleOpen('email')}
                        />
                    </ListItem>
                    <ListItem divider button>
                        <ListItemText
                            primary="Password"
                            secondary="Click to update"
                            aria-haspopup="true"
                            onClick={_ => handleOpen('password')}
                        />
                    </ListItem>

                    <ChangeNameDialog
                        open={open === 'name'}
                        onClose={handleClose}
                        value={fullname}
                    />
                    <ChangeEmailDialog
                        open={open === 'email'}
                        onClose={handleClose}
                        value={email}
                    />
                    <ChangePasswordDialog
                        open={open === 'password'}
                        onClose={handleClose}
                    />
                </List>

                <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
                    <SnackbarAlert onClose={handleSnackbarClose} severity={snackbarProperties.severity}>
                        {snackbarProperties.message}
                    </SnackbarAlert>
                </Snackbar>
            </Paper>

            <br />

            <Paper>
                <Container className={classes.header}>
                    <Typography variant="h5">
                        About this project
                    </Typography>
                </Container>
                <Divider />
                <Container className={classes.about}>
                    <Typography>
                        The <a href={`https://${process.env.REACT_APP_APP_DOMAIN}/`}>My Data</a> app for patients and the <a href={`https://${process.env.REACT_APP_DASHBOARD_DOMAIN}/`}>My Data Dashboard</a> website for senior responsible officers were developed by <a href="https://jezz.me/">Jeremy Lo Ying Ping</a> in 2021 as part of a <a href="https://www.ucl.ac.uk/computer-science/">UCL Computer Science</a> summer research project.
                        <br /><br />
                        The aim of the project was to provide a way for patients to track their symptoms over time — including through the use of an offline, on-device speech model to garner a measure of speaking rate as a potential proxy for breathlessness — and only at their behest, share the data collected — over which they maintain full control — so that it may potentially contribute towards valuable research into respiratory conditions.
                    </Typography>
                </Container>
            </Paper>
        </div>
    )
}
