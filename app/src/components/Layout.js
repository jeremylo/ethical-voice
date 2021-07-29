import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { blue } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import MicIcon from '@material-ui/icons/Mic';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';
import {
    Link, useLocation
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    bottomNavigation: {
        flexGrow: 1,
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#fafafa'
    },
    mainContainer: {
        marginBottom: "5rem",
    }
}));

const theme = createTheme({
    palette: {
        primary: blue,
    },
});

export default function Layout(props) {
    const classes = useStyles();
    const value = useLocation().pathname.replace("/", "");

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            My Data
                        </Typography>
                        <IconButton color="inherit" aria-label="settings" component={Link} to="/settings" value="settings">
                            <SettingsIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.mainContainer}>
                {props.children}
            </div>
            <BottomNavigation
                value={value}
                showLabels
                className={classes.bottomNavigation}
            >
                <BottomNavigationAction component={Link} to="/" value="" label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction component={Link} to="/analyse" value="analyse" label="Record" icon={<MicIcon />} />
                <BottomNavigationAction component={Link} to="/results" value="results" label="Results" icon={<TimelineIcon />} />
            </BottomNavigation>
        </ThemeProvider>
    );
}
