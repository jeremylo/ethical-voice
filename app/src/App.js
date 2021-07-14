import React from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import Layout from './components/Layout';


function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/analyse">
              Analyse page
            </Route>
            <Route path="/results">
              Results page
            </Route>
            <Route path="/settings">
              Settings page
            </Route>
            <Route path="/">
              Home page
            </Route>
          </Switch>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
