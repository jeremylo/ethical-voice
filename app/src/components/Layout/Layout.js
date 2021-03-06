import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MicIcon from '@material-ui/icons/Mic';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';
import {
    Link, useLocation
} from "react-router-dom";
import { useAuth } from '../../auth/use-auth';
import TopBar from './TopBar';


const useStyles = makeStyles((theme) => ({
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

export default function Layout(props) {
    const classes = useStyles();
    const value = useLocation().pathname.replace("/", "");
    const auth = useAuth();

    return (
        <>
            <TopBar loggedIn={!!auth.user} />
            <div className={classes.mainContainer}>
                {props.children}
            </div>
            <BottomNavigation
                value={value}
                showLabels
                className={classes.bottomNavigation}
            >
                <BottomNavigationAction component={Link} to="/" value="" label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction component={Link} to="/submit" value="submit" label="Record" icon={<MicIcon />} />
                <BottomNavigationAction component={Link} to="/results" value="results" label="Results" icon={<TimelineIcon />} />
            </BottomNavigation>
        </>
    );
}
