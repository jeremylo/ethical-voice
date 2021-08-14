import { Box, CircularProgress, createTheme, makeStyles, ThemeProvider, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import PublicOnlyRoute from './auth/PublicOnlyRoute';
import { AuthProvider, useAuth } from './auth/use-auth';
import Activate from './components/Activate';
import Error404 from './components/Error404';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Patients from './components/Patients';
import Refer from './components/Refer';
import ResetPassword from './components/ResetPassword';
import Settings from './components/Settings';
import Tests from './components/Tests';


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
  if (auth.sro === null) {
    return <Loading />;
  }

  return <Router>
    <Switch>
      { /* Logged out routes */}
      <PublicOnlyRoute path="/login/:status?">
        <Login />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/activate/:token">
        <Activate />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/request-password-reset">
        <ForgotPassword />
      </PublicOnlyRoute>
      <PublicOnlyRoute path="/reset-password/:sroid/:token">
        <ResetPassword />
      </PublicOnlyRoute>

      { /* Logged in routes */}
      <PrivateRoute exact path="/">
        <Layout><Home /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/patients">
        <Layout><Patients /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/tests">
        <Layout><Tests /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/refer">
        <Layout><Refer /></Layout>
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
