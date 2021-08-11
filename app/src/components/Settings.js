

import { Container, Divider, List, ListItem, ListItemText, makeStyles, Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import AboutThisApp from './settings/AboutThisAppDialog';
import ChangeEmailDialog from './settings/ChangeEmailDialog';
import ChangeOutwardPostcodeDialog from './settings/ChangeOutwardPostcodeDialog';
import ChangePasswordDialog from './settings/ChangePasswordDialog';
import ChangeSharingDialog from './settings/ChangeSharingDialog';


function SnackbarAlert(props) {
    return <Alert elevation={6} variant="filled" {...props} />;
}

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

export default function Settings() {
    const classes = useStyles();
    const auth = useAuth();
    const history = useHistory();

    // Snackbar
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "success",
        message: "Success"
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
    const email = auth.user.email;
    const [outwardPostcode, setOutwardPostcode] = useState(auth.user.outwardPostcode);
    const [sharing, setSharing] = useState(auth.user.sharing);

    const handleOpen = (id) => {
        setOpen(id);
    };

    const handleClose = (newValue) => {
        if (newValue !== undefined) {
            switch (open) {
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
                                message: 'Server error — awfully sorry, we cannot change your email right now.'
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

                case 'outward-postcode':
                    auth.setOutwardPostcode(newValue)
                        .then((successful) => {
                            if (successful) {
                                setOutwardPostcode(newValue);
                                auth.setUser({ ...auth.user, outwardPostcode: newValue });

                                handleSnackbarOpen({
                                    severity: 'success',
                                    message: 'Outward postcode updated successfully.'
                                });
                            } else {
                                throw new Error()
                            }
                        })
                        .catch(() => {
                            handleSnackbarOpen({
                                severity: 'error',
                                message: 'Server error — awfully sorry, your outward postcode could not be changed. Please try again later!'
                            });
                        })
                    break;

                case 'sharing':
                    auth.setSharing(newValue)
                        .then((successful) => {
                            if (!successful) {
                                throw new Error();
                            }

                            setSharing(newValue);
                            auth.setUser({ ...auth.user, sharing: newValue });

                            handleSnackbarOpen({
                                severity: 'success',
                                message: 'Sharing preference updated successfully.'
                            });
                        })
                        .catch(() => {
                            handleSnackbarOpen({
                                severity: 'error',
                                message: 'Server error — awfully sorry, your sharing preference could not be changed at this time. Please try again later!'
                            });
                        });
                    break;

                default:
                    break;
            }
        }

        setOpen(null);
    };

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.header}>
                <Typography variant="h5">
                    Settings
                </Typography>
            </Container>

            <List>
                <Divider />
                <ListItem divider>
                    <ListItemText primary="Reference ID" secondary={auth.user.refId} />
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
                <ListItem divider button>
                    <ListItemText
                        primary="Outward Postcode"
                        secondary={outwardPostcode}
                        aria-haspopup="true"
                        onClick={_ => handleOpen('outward-postcode')}
                    />
                </ListItem>
                <ListItem divider button>
                    <ListItemText
                        primary="Sharing agreement"
                        secondary={sharing ? "You have chosen to share future submissions with your senior responsible officer." : "You have chosen not to share future submissions with your senior responsible officer."}
                        aria-haspopup="true"
                        onClick={_ => handleOpen('sharing')}
                    />
                </ListItem>
                <ListItem divider button>
                    <ListItemText
                        primary="About this app"
                        aria-haspopup="true"
                        onClick={_ => handleOpen('about')}
                    />
                </ListItem>
                <ListItem divider button>
                    <ListItemText
                        primary="Log out"
                        onClick={_ => {
                            auth.logout();
                            history.push("/");
                        }}
                    />
                </ListItem>

                <ChangeEmailDialog
                    open={open === 'email'}
                    onClose={handleClose}
                    value={email}
                />
                <ChangePasswordDialog
                    open={open === 'password'}
                    onClose={handleClose}
                />
                <ChangeOutwardPostcodeDialog
                    open={open === 'outward-postcode'}
                    onClose={handleClose}
                    value={outwardPostcode}
                />
                <ChangeSharingDialog
                    open={open === 'sharing'}
                    onClose={handleClose}
                    value={sharing}
                />
                <AboutThisApp
                    open={open === 'about'}
                    onClose={handleClose}
                />
            </List>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <SnackbarAlert onClose={handleSnackbarClose} severity={snackbarProperties.severity}>
                    {snackbarProperties.message}
                </SnackbarAlert>
            </Snackbar>
        </div>
    )
}
