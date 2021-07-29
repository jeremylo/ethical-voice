import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import Analyse from './components/Analyse';
import Home from './components/Home';
import Layout from './components/Layout';
import Results from './components/Results';
import Settings from './components/Settings';


function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/analyse">
              <Analyse />
            </Route>
            <Route path="/results">
              <Results />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
