import { makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useArtistPage } from '../../hooks/useArtistPage';
import { FeedItem } from './FeedItem';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  feedItem: {
    marginBottom: theme.spacing(2),
  },
}));

export function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const { isLoading, data } = useArtistPage(username);
  const classes = useStyles();

  if (isLoading || !data) return <div>Loading</div>;

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h3">
        {data.title}
      </Typography>
      {data.feed.map((f) => (
        <FeedItem key={f.id} feedItem={f} className={classes.feedItem} />
      ))}
    </div>
  );
}
