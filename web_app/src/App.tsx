import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { Home } from './pages/home';
import { AuthProvider } from './providers/AuthProvider';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicHome } from './pages/public-home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ArtistPageIndex } from './pages/artistPages/ArtistPageIndex';
import { ArtistPageShow } from './pages/artistPages/ArtistPageShow';
import DialogProvider from './providers/DialogProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <AuthProvider>
              <Layout>
                <Switch>
                  <PrivateRoute
                    path="/"
                    exact
                    renderPublic={() => <PublicHome />}
                  >
                    <Home />
                  </PrivateRoute>
                  <PrivateRoute path="/artistpages/:artistId">
                    <ArtistPageShow />
                  </PrivateRoute>
                  <PrivateRoute path="/artistpages">
                    <ArtistPageIndex />
                  </PrivateRoute>
                </Switch>
              </Layout>
            </AuthProvider>
          </DialogProvider>
        </QueryClientProvider>
      </Router>
    </>
  );
}

export default App;
