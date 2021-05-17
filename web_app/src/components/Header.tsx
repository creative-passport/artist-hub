import {
  AppBar,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { PropsWithChildren } from 'react';
import { ReactComponent as Logo } from 'images/logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    fontWeight: 900,
    color: '#777777',
    fontSize: 20,
  },
  logo: {
    width: 40,
    height: 41,
  },
  toolbar: {
    minHeight: 72,
    marginLeft: 40,
    marginRight: 40,
  },
}));

interface HeaderProps {
  noShadow?: boolean;
}

export function Header({
  children,
  noShadow = false,
}: PropsWithChildren<HeaderProps>) {
  const classes = useStyles();

  return (
    <AppBar position="static" elevation={noShadow ? 0 : 1} color="transparent">
      <Toolbar className={classes.toolbar}>
        <Logo title="ArtistHub" className={classes.logo} />
        <Typography variant="h6" component="h1" className={classes.title}>
          ArtistHub
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
