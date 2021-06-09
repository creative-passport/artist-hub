import { Avatar, Button, makeStyles, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { ArtistPage } from 'types/api-types';
import { CoverImage } from 'components/CoverImage';
import { ReactComponent as DeleteIcon } from 'images/delete-icon.svg';
import { ReactComponent as ManageIcon } from 'images/manage-icon.svg';
import { useDialog } from 'providers/DialogProvider';
import { useAdminDeleteArtistPage } from 'hooks/useAdminArtistPages';

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  avatar: {
    width: 100,
    height: 100,
    border: '3px solid white',
    marginBottom: -30,
  },
}));

interface CreateNewProps {
  page: ArtistPage;
}

export function PageCard({ page }: CreateNewProps) {
  const classes = useStyles();
  const deletePage = useAdminDeleteArtistPage();
  const showDialog = useDialog();

  const handleDelete = () => {
    showDialog(
      'Delete artist page',
      'Are you sure you want to delete the artist page?',
      {
        onConfirm: () => deletePage.mutate(page.id),
        confirmButton: 'Delete',
      }
    );
  };

  return (
    <div className={classes.root}>
      <CoverImage className={classes.cover} src={page.coverImage}>
        <Avatar className={classes.avatar} src={page.profileImage} />
      </CoverImage>
      <div className={classes.container}>
        <Typography className={classes.title}>{page.title}</Typography>
        <div className={classes.actions}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            DELETE
          </Button>
          <Button
            variant="text"
            color="inherit"
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
