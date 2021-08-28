import { Box, CircularProgress, createTheme, makeStyles, ThemeProvider, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import PublicOnlyRoute from './auth/PublicOnlyRoute';
import { AuthProvider, useAuth } from './auth/use-auth';
import Layout from './components/Layout/Layout';
import Activate from './pages/Activate/Activate';
import Error404 from './pages/Error404';
import Export from './pages/Export';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Patient from './pages/Patient';
import Patients from './pages/Patients';
import Refer from './pages/Refer/Refer';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings/Settings';
import Sros from './pages/Sros/Sros';
import Submissions from './pages/Submissions/Submissions';
import Tests from './pages/Tests/Tests';


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
      <PrivateRoute path="/export">
        <Layout><Export /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/submissions">
        <Layout><Submissions /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/sros">
        <Layout><Sros /></Layout>
      </PrivateRoute>
      <PrivateRoute path="/patient/:id">
        <Layout><Patient /></Layout>
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
