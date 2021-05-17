import {
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  useAdminDeleteArtistPage,
  useAdminReadArtistPage,
} from 'hooks/useAdminArtistPages';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import { useDialog } from 'providers/DialogProvider';
import { useState } from 'react';
import AddActivityPubDialog from './AddActivityPubDialog';
import { FollowItem } from './FollowItem';

const useStyles = makeStyles((theme) => ({
  h3: {
    marginTop: theme.spacing(2),
  },
  dataSource: {
    margin: theme.spacing(2),
  },
  dataSourceLink: {
    marginRight: theme.spacing(1),
  },
}));

export function ArtistPageShow() {
  const classes = useStyles();
  const { artistId } = useParams<{ artistId: string }>();
  const { isLoading, data } = useAdminReadArtistPage(artistId);
  const deletePage = useAdminDeleteArtistPage();
  const history = useHistory();
  const showDialog = useDialog();
  const [addDataSource, setAddDataSource] = useState(false);

  const handleDelete = () => {
    showDialog(
      'Delete artist page',
      'Are you sure you want to delete the artist page?',
      {
        onConfirm: () =>
          deletePage
            .mutateAsync(artistId)
            .then(() => history.push('/admin/artistpages')),
        confirmButton: 'Delete',
      }
    );
  };

  if (isLoading || !data) return <div>Loading</div>;

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} color="inherit" to="/">
          Artist Hub
        </Link>
        <Link component={RouterLink} color="inherit" to="/admin/artistpages">
          Artist Pages
        </Link>
        <Typography color="textPrimary">{data.title}</Typography>
      </Breadcrumbs>
      <Typography component="h1" variant="h2">
        Artist Pages
      </Typography>
      <Typography component="h2" variant="h3">
        {data.title}
      </Typography>
      <Typography component="h3" variant="h4" className={classes.h3}>
        Actions
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Delete page
      </Button>
      <Typography component="h3" variant="h4" className={classes.h3}>
        Linked social networks
      </Typography>
      {data.following.map((f) => (
        <FollowItem artistPageId={artistId} follow={f} key={f.id} />
      ))}
      <Button variant="contained" onClick={() => setAddDataSource(true)}>
        Add ActivityPub data source
      </Button>
      <Typography>e.g. Mastodon, Pixelfed, PeerTube, etc</Typography>
      <AddActivityPubDialog
        artistId={artistId}
        open={addDataSource}
        onSuccess={() => setAddDataSource(false)}
        onCancel={() => setAddDataSource(false)}
      />
    </div>
  );
}
