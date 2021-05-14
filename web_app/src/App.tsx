import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
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
import { Footer } from './components/Footer';

const queryClient = new QueryClient();

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  main: {
    flex: '1 0 auto',
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Router>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <div className={classes.container}>
              <div className={classes.main}>
                <Switch>
                  <Route path="/p/:username">
                    <Header />
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
                          <Route>
                            <NotFound />
                          </Route>
                        </Switch>
                      </Layout>
                    </AuthProvider>
                  </Route>
                </Switch>
              </div>
              <Footer />
            </div>
          </DialogProvider>
        </QueryClientProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
