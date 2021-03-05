import { Button, makeStyles, Typography } from '@material-ui/core';
import { useArtistPages, useCreateArtistPage } from '../../hooks/useApi';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import NewArtistPageDialog from './NewArtistPageDialog';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { AxiosError } from 'axios';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(2),
  },
}));

export function ArtistPageIndex() {
  const classes = useStyles();
  const { isLoading, data = [] } = useArtistPages();
  const [newArtistOpen, setNewArtistOpen] = useState(false);
  const createPage = useCreateArtistPage();

  const handleCancel = () => setNewArtistOpen(false);

  const handleSuccess = (
    newArtistPage: Partial<ArtistPage>,
    setError: (message: string) => void
  ) => {
    console.log('Create artist', newArtistPage);
    createPage
      .mutateAsync(newArtistPage)
      .then((data) => {
        setNewArtistOpen(false);
        console.log('new page', data);
      })
      .catch((e: AxiosError) => {
        setError(e.response?.data.message);
      });
  };

  return (
    <div>
      <NewArtistPageDialog
        open={newArtistOpen}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
      <Typography component="h1" variant="h2">
        Artist Pages
      </Typography>
      <div>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => setNewArtistOpen(true)}
        >
          Create new page
        </Button>
      </div>
      {isLoading
        ? 'Loading'
        : data.length > 0
        ? data?.map((p) => (
            <div key={p.id}>
              <Link component={RouterLink} to={`/artistpages/${p.id}`}>
                {p.name}
              </Link>
            </div>
          ))
        : 'You have no artist pages'}
    </div>
  );
}
