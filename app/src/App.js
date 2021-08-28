import { Box, CircularProgress, createTheme, makeStyles, ThemeProvider, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import PublicOnlyRoute from './auth/PublicOnlyRoute';
import { AuthProvider, useAuth } from './auth/use-auth';
import Layout from './components/Layout/Layout';


const Activate = lazy(() => import('./pages/Activate/Activate'));
const Submit = lazy(() => import('./pages/Submit/Submit'));
const Error404 = lazy(() => import('./pages/Error404/Error404'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const Results = lazy(() => import('./pages/Results/Results'));
const Settings = lazy(() => import('./pages/Settings/Settings'));


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
      <PublicOnlyRoute path="/register/:refId?">
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
      <PrivateRoute path="/submit">
        <Layout><Submit /></Layout>
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
        <Suspense fallback={Loading()}>
          <Routes />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  </div>;
}
