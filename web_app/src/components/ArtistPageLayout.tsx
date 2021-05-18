import {
  Avatar,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { CoverImage } from './CoverImage';

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
    color: '#444444',
    fontSize: 20,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

interface ArtistPageLayoutProps {
  isLoading?: boolean;
  leftColumn?: React.ReactNode;
  middleColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  title?: string;
  url?: string;
}

export function ArtistPageLayout({
  isLoading = false,
  leftColumn,
  middleColumn,
  rightColumn,
  title,
  url,
}: ArtistPageLayoutProps) {
  const classes = useStyles();

  if (isLoading) return <div>Loading</div>;

  return (
    <div>
      <CoverImage className={classes.coverImage}>
        <Container maxWidth="md" className={classes.coverImageContainer}>
          <Avatar className={classes.avatar}>
            {title && title.length >= 1 ? title[0] : ''}
          </Avatar>
          <Typography component="h2" className={classes.title}>
            {title}
          </Typography>
        </Container>
      </CoverImage>
      <Container maxWidth="md">
        <Typography className={classes.url}>{url}</Typography>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            {leftColumn}
          </Grid>
          <Grid item xs={6}>
            {middleColumn}
          </Grid>
          <Grid item xs={3}>
            {rightColumn}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
