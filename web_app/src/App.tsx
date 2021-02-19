import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AdminIndex } from './pages/admin/AdminIndex';
import { Home } from './pages/home';
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/admin">
            <AdminIndex />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
