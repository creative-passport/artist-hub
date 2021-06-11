import { Login } from 'components/Login';
import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import { Center } from 'components/Center';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
    background: 'black',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: theme.spacing(4),
  },
  body: {
    background: '#eee',
  },
  paper: {
    padding: theme.spacing(4),
  },
}));

export function PublicHome() {
  const classes = useStyles();

  useEffect(() => {
    document.body.classList.add(classes.body);
    return () => {
      document.body.classList.remove(classes.body);
    };
  });

  return (
    <div>
      <Container>
        <Center>
          <div className={classes.title}>
            <Typography variant="h1">ARTIST HUB</Typography>
          </div>
        </Center>
        <Paper square className={classes.paper}>
          <Center>
            <Typography variant="h6">
              Join Artist Hub to get your social feeds all in one place.
            </Typography>

            <Login />
          </Center>
        </Paper>
      </Container>
    </div>
  );
}
