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
    background: '#000',
    color: '#fff',
    fontSize: 40,
    fontWeight: 700,
    padding: '4px 14px',
    marginLeft: theme.spacing(4) - 14,
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
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  buttons: {
    float: 'right',
    marginTop: -20,
    display: 'flex',
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  topLinks: {
    display: 'block',
    flexGrow: 1,
  },
}));

interface ArtistPageLayoutProps {
  isLoading?: boolean;
  buttons?: React.ReactNode;
  leftColumn?: React.ReactNode;
  middleColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  title?: string;
  url?: string;
  profileImage?: string;
  coverImage?: string;
  topLinks?: React.ReactNode;
}

export function ArtistPageLayout({
  isLoading = false,
  profileImage,
  coverImage,
  buttons,
  leftColumn,
  middleColumn,
  rightColumn,
  title,
  url,
  topLinks,
}: ArtistPageLayoutProps) {
  const classes = useStyles();

  if (isLoading) return <div>Loading</div>;

  return (
    <div>
      <CoverImage className={classes.coverImage} src={coverImage}>
        {topLinks && (
          <Container maxWidth="md" className={classes.topLinks}>
            {topLinks}
          </Container>
        )}
        <Container maxWidth="md" className={classes.coverImageContainer}>
          <Avatar className={classes.avatar} src={profileImage}>
            {title && title.length >= 1 ? title[0] : ''}
          </Avatar>
          <Typography component="h2" className={classes.title}>
            {title}
          </Typography>
        </Container>
      </CoverImage>
      <Container maxWidth="md">
        {buttons && <div className={classes.buttons}>{buttons}</div>}
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
