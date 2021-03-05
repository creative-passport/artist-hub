import {
  AppBar,
  Container,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { PropsWithChildren } from 'react';
import { useAuthState } from '../providers/AuthProvider';
import { Logout } from './Logout';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export function Layout({ children }: PropsWithChildren<{}>) {
  const { signedIn } = useAuthState();
  const classes = useStyles();

  if (signedIn) {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Artist Hub
            </Typography>
            {signedIn && (
              <div>
                <Logout />
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <main>{children}</main>
        </Container>
      </div>
    );
  }

  return (
    <Container maxWidth="md">
      <div>{children}</div>
    </Container>
  );
}
