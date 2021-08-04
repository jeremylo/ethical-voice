

import { Container, Divider, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import ChangeEmailDialog from './settings/ChangeEmailDialog';
import ChangeOutwardPostcodeDialog from './settings/ChangeOutwardPostcodeDialog';
import ChangePasswordDialog from './settings/ChangePasswordDialog';

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

    const [open, setOpen] = useState(null);
    const [email, setEmail] = useState('jeremy@example.com');
    const [outwardPostcode, setOutwardPostcode] = useState('SW1');

    const handleOpen = (id) => {
        setOpen(id);
    };

    const handleClose = (newValue) => {
        if (newValue) {
            switch (open) {
                case 'email':
                    setEmail(newValue);
                    break;
                case 'outward-postcode':
                    setOutwardPostcode(newValue);
                    break;

                default:
                    break;
            }
        }

        setOpen(null);
    };

    const history = useHistory();
    const auth = useAuth();

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
                    <ListItemText primary="Reference ID" secondary="123456789" />
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
                        secondary="You have chosen to share your submissions with your senior responsible officer."
                        aria-haspopup="true"
                    // onClick={_ => handleOpen('outward-postcode')}
                    />
                </ListItem>
                <ListItem divider button>
                    <ListItemText primary="About this app" />
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
            </List>
        </div>
    )
}
