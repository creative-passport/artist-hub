import {
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  useAdminArtistPages,
  useAdminCreateArtistPage,
} from 'hooks/useAdminArtistPages';
import { useState } from 'react';
import NewArtistPageDialog from './NewArtistPageDialog';
import { useHistory } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ArtistPage } from 'types/api-types';
import { CreateNew } from './CreateNew';
import { PageCard } from './PageCard';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(2),
  },
  welcome: {
    fontSize: 40,
    fontWeight: 300,
    color: '#222222',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(8),
  },
  email: {
    fontSize: 20,
    color: '#777777',
    marginLeft: theme.spacing(8),
    marginBottom: theme.spacing(3.5),
  },
  divider: {
    marginTop: 40,
    marginBottom: 40,
  },
  yourPages: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing(5),
  },
}));

export function ArtistPageIndex() {
  const classes = useStyles();
  const { isLoading, data = [] } = useAdminArtistPages();
  const [newArtistOpen, setNewArtistOpen] = useState(false);
  const createPage = useAdminCreateArtistPage();
  const history = useHistory();

  const handleCancel = () => setNewArtistOpen(false);

  const handleSuccess = (
    newArtistPage: Partial<ArtistPage>,
    setError: (message: string) => void
  ) => {
    createPage
      .mutateAsync(newArtistPage)
      .then((data) => {
        setNewArtistOpen(false);
        history.push(`/admin/artistpages/${data.id}`);
      })
      .catch((e: AxiosError) => {
        setError(e.response?.data.message);
      });
  };

  return (
    <Container maxWidth="lg">
      <NewArtistPageDialog
        open={newArtistOpen}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
      <Typography component="h1" className={classes.welcome}>
        Welcome Music Maker
      </Typography>
      <Typography className={classes.email}>name.surname@email.com</Typography>
      <Divider className={classes.divider} />
      <Typography component="h2" className={classes.yourPages}>
        Your pages
      </Typography>
      {isLoading ? (
        'Loading'
      ) : (
        <>
          <Grid container spacing={2} alignItems="stretch">
            {data?.map((p) => (
              <Grid item xs={4} lg={3} key={p.id}>
                <PageCard page={p} />
              </Grid>
            ))}
            <Grid item xs={4} lg={3}>
              <CreateNew onClick={() => setNewArtistOpen(true)} />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
