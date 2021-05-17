import { Button, makeStyles, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { ArtistPage } from 'types/api-types';
import { CoverImage } from 'pages/artistPage/CoverImage';
import { ReactComponent as DeleteIcon } from 'images/delete-icon.svg';
import { ReactComponent as ManageIcon } from 'images/manage-icon.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    border: 'none',
    borderRadius: 24,
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.2)',
    background: 'transparent',
    textDecoration: 'none',
    height: '100%',
    display: 'block',
  },
  cover: {
    height: 120,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(3),
    fontSize: 20,
    color: '#222222',
    fontWeight: 'bold',
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    width: '100%',
    '& > *': {
      flexGrow: 1,
    },
  },
}));

interface CreateNewProps {
  page: ArtistPage;
  onClick?: () => void;
}

export function PageCard({ page, onClick }: CreateNewProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CoverImage className={classes.cover} />
      <div className={classes.container}>
        <Typography className={classes.title}>{page.title}</Typography>
        <div className={classes.actions}>
          <Button startIcon={<DeleteIcon />}>DELETE</Button>
          <Button
            component={RouterLink}
            startIcon={<ManageIcon />}
            to={`/admin/artistpages/${page.id}`}
          >
            MANAGE
          </Button>
        </div>
      </div>
    </div>
  );
}
