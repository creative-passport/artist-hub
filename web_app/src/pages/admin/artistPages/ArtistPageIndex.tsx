import { Button, makeStyles, Typography } from '@material-ui/core';
import {
  useAdminArtistPages,
  useAdminCreateArtistPage,
} from '../../../hooks/useAdminArtistPages';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import NewArtistPageDialog from './NewArtistPageDialog';
import { Link } from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { AxiosError } from 'axios';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(2),
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
              <Link component={RouterLink} to={`/admin/artistpages/${p.id}`}>
                {p.title}
              </Link>
            </div>
          ))
        : 'You have no artist pages'}
    </div>
  );
}
