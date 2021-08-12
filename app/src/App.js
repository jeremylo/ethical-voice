import { Box, CircularProgress, createTheme, makeStyles, ThemeProvider, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import PublicOnlyRoute from './auth/PublicOnlyRoute';
import { AuthProvider, useAuth } from './auth/use-auth';
import Activate from './components/Activate';
import Analyse from './components/Analyse';
import Error404 from './components/Error404';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Results from './components/Results';
import Settings from './components/Settings';


const theme = createTheme({
  palette: {
    primary: blue,
  },
});

const useStyles = makeStyles({
  statusBox: {
    margin: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
});

function Loading() {
  const classes = useStyles();

  return <Box textAlign='center' className={classes.statusBox}>
    <Typography>Loading</Typography><br />
    <CircularProgress />
  </Box>
}


function Routes() {
  const auth = useAuth();
  if (auth.user === null) {
    return <Loading />;
  }

  return <Router>
    <Switch>
      { /* Logged out routes */}
      <PublicOnlyRoute path="/login/:status?">
        <Login />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/register">
        <Register />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/activate/:refId/:token">
        <Activate />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/request-password-reset">
        <ForgotPassword />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/reset-password/:refId/:token">
        <ResetPassword />
      </PublicOnlyRoute>

      { /* Logged in routes */}
      <PrivateRoute exact path="/">
        <Layout><Home /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/analyse">
        <Layout><Analyse /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/results">
        <Layout><Results /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/settings">
        <Layout><Settings /></Layout>
      </PrivateRoute>

      { /* 404 */}
      <Route><Error404 /></Route>
    </Switch>
  </Router>;
}


export default function App() {
  return <div className="App">
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  </div>;
}
