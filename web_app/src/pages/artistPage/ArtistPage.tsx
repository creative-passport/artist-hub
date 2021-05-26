import { makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useArtistPage } from 'hooks/useArtistPage';
import { FeedItem } from './FeedItem';
import { ArtistPageLayout } from 'components/ArtistPageLayout';

const useStyles = makeStyles((theme) => ({
  feedItem: {
    marginBottom: theme.spacing(2),
  },
  title: {
    textShadow: '0px 0px 24px rgba(0, 0, 0, 0.5)',
    color: 'black',
    fontSize: 40,
    fontWeight: 700,
    marginLeft: theme.spacing(4),
    marginTop: 0,
    marginBottom: theme.spacing(3),
  },
  coverImage: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  avatar: {
    width: 180,
    height: 180,
    border: '4px solid white',
    marginBottom: -75,
  },
  coverImageContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  url: {
    paddingLeft: 180 + theme.spacing(4),
    color: '#444440',
    fontSize: 20,
    fontWeight: 300,
    fontStyle: 'italic',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  headline: {
    fontWeight: 700,
    fontSize: 20,
    color: '#222222',
  },
  officialLinks: {
    fontWeight: 500,
    fontSize: 12,
    color: '#444440',
    textTransform: 'uppercase',
  },
  description: {},
}));

export function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const { isLoading, data } = useArtistPage(username);
  const classes = useStyles();

  if (isLoading || !data) return <div>Loading</div>;

  const officialLinks = []; // Not yet implemented

  return (
    <ArtistPageLayout
      title={data.title}
      url={data.url}
      profileImage={data.profileImage}
      leftColumn={
        <>
          <Typography
            className={classes.headline}
            variant="h6"
            component="h3"
            gutterBottom
          >
            {data.headline}
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {data.description}
          </Typography>
        </>
      }
      middleColumn={data.feed.map((f) => (
        <FeedItem key={f.id} feedItem={f} className={classes.feedItem} />
      ))}
      rightColumn={
        officialLinks.length > 0 && (
          <>
            <Typography
              className={classes.officialLinks}
              variant="h6"
              component="h3"
              gutterBottom
            >
              Official Links
            </Typography>
          </>
        )
      }
    />
  );
}
