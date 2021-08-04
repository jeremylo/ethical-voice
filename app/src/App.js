import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from './auth/use-auth';
import Analyse from './components/Analyse';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Results from './components/Results';
import Settings from './components/Settings';


const theme = createTheme({
  palette: {
    primary: blue,
  },
});


function App() {
  return (
    <Router>
      <div className="App">
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Switch>
              { /* Logged out routes */}
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>

              { /* Logged in routes */}
              <Layout>
                <PrivateRoute exact path="/">
                  <Home />
                </PrivateRoute>
                <PrivateRoute path="/analyse">
                  <Analyse />
                </PrivateRoute>
                <PrivateRoute path="/results">
                  <Results />
                </PrivateRoute>
                <PrivateRoute path="/settings">
                  <Settings />
                </PrivateRoute>
              </Layout>
            </Switch>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
