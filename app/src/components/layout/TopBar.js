import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../../contexts/user-context';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));

export default function TopBar() {
    const classes = useStyles();

    return <div className={classes.root}>
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    My Data
                </Typography>
                <UserContext.Consumer>
                    {({ loggedIn }) => loggedIn && <IconButton color="inherit" aria-label="settings" component={Link} to="/settings" value="settings">
                        <SettingsIcon />
                    </IconButton>}
                </UserContext.Consumer>
            </Toolbar>
        </AppBar>
    </div>;
}
