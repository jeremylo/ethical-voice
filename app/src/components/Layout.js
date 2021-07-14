import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import blue from '@material-ui/core/colors/blue';
import Container from '@material-ui/core/Container';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AssessmentIcon from '@material-ui/icons/Assessment';
import HomeIcon from '@material-ui/icons/Home';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';
import {
    Link
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
        bottom: 0
    }
}));

const theme = createTheme({
    palette: {
        primary: blue,
    },
});

export default function Layout(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Breathlessness Analyser
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Container maxWidth="sm">
                {props.children}
            </Container>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.bottomNavigation}
            >
                <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction component={Link} to="/analyse" label="Analyse" icon={<AssessmentIcon />} />
                <BottomNavigationAction component={Link} to="/results" label="Results" icon={<TimelineIcon />} />
            </BottomNavigation>
        </ThemeProvider>
    );
}

/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav> */
