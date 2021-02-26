import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { AdminIndex } from './pages/admin/AdminIndex';
import { Home } from './pages/home';
import { AuthProvider } from './providers/AuthProvider';
import { Layout } from './components/Layout';

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Layout>
            <Switch>
              <Route path="/admin">
                <AdminIndex />
              </Route>
              <Route path="/" exact>
                <Home />
              </Route>
            </Switch>
          </Layout>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
