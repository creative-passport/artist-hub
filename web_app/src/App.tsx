import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { Home } from './pages/home';
import { AuthProvider } from './providers/AuthProvider';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicHome } from './pages/public-home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ArtistPageIndex } from './pages/admin/artistPages/ArtistPageIndex';
import { ArtistPageShow } from './pages/admin/artistPages/ArtistPageShow';
import { ArtistPage } from './pages/artistPage/ArtistPage';
import DialogProvider from './providers/DialogProvider';
import { NotFound } from './pages/NotFound';
import { Header } from './components/Header';
import { appTheme } from './theme';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Router>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <Header />
            <Switch>
              <Route path="/p/:username">
                <ArtistPage />
              </Route>
              <Route>
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
                      <PrivateRoute path="/admin/artistpages/:artistId">
                        <ArtistPageShow />
                      </PrivateRoute>
                      <PrivateRoute path="/admin/artistpages">
                        <ArtistPageIndex />
                      </PrivateRoute>
                      <Route path="/p/:username">
                        <ArtistPage />
                      </Route>
                      <Route>
                        <NotFound />
                      </Route>
                    </Switch>
                  </Layout>
                </AuthProvider>
              </Route>
            </Switch>
          </DialogProvider>
        </QueryClientProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
