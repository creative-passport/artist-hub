import { Button, makeStyles, Typography } from '@material-ui/core';
import {
  useAdminReadArtistPage,
  useAdminUpdateArtistPage,
} from 'hooks/useAdminArtistPages';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FollowItem } from './FollowItem';
import { ArtistPageLayout } from 'components/ArtistPageLayout';
import { ColumnTitle } from './ColumnTitle';
import AddIcon from '@material-ui/icons/Add';
import AddActivityCard from './AddActivityCard';
import EditIcon from '@material-ui/icons/EditOutlined';
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import EditArtistPageDialog from './EditArtistPageDialog';
import { UpdateArtistPage } from 'types/api-types';
import { EditTextField } from 'components/EditTextField';
import BackIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 16,
    width: '100%',
    textTransform: 'uppercase',
    height: 56,
  },
  editButton: {
    backgroundColor: '#fff',
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: '#fff',
      },
    },
  },
  pageInfoHeading: {
    marginTop: theme.spacing(4),
  },
  backToDashboard: {
    background: '#222222',
    color: '#fff',
    padding: '4px 6px',
    marginTop: theme.spacing(4),
    display: 'inline-flex',
    textTransform: 'uppercase',
    alignItems: 'center',
    textDecoration: 'none',
  },
}));

export function ArtistPageShow() {
  const { artistId } = useParams<{ artistId: string }>();
  const { isLoading, data } = useAdminReadArtistPage(artistId);
  const [addDataSource, setAddDataSource] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const updatePage = useAdminUpdateArtistPage();
  const classes = useStyles();

  if (isLoading || !data) return <div>Loading</div>;

  const handleEditPage = (newData: UpdateArtistPage) => {
    updatePage.mutate(newData);
    setEditPage(false);
  };

  const handleEditHeadline = (headline: string, done: () => void) => {
    updatePage.mutateAsync({ id: data.id, headline }).then(done);
  };

  const handleEditDescription = (description: string, done: () => void) => {
    updatePage.mutateAsync({ id: data.id, description }).then(done);
  };

  return (
    <>
      <ArtistPageLayout
        title={data.title}
        url={data.url}
        profileImage={data.profileImage}
        coverImage={data.coverImage}
        topLinks={
          <>
            <Link to="/admin/artistpages" className={classes.backToDashboard}>
              <BackIcon fontSize="small" />
              <Typography variant="body2">Back to your dashboard</Typography>
            </Link>
          </>
        }
        buttons={
          <>
            <Button
              variant="outlined"
              className={classes.editButton}
              startIcon={<EditIcon />}
              onClick={() => setEditPage(true)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              href={data.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              View public page
            </Button>
          </>
        }
        leftColumn={
          <>
            <ColumnTitle
              title="Page info"
              subtitle="Manage the page information"
            />
            <Typography
              className={classes.pageInfoHeading}
              variant="h5"
              component="h4"
              gutterBottom
            >
              <label htmlFor="headline">Headline</label>
            </Typography>
            <EditTextField
              value={data.headline}
              onEdit={handleEditHeadline}
              TextFieldProps={{
                id: 'headline',
              }}
            />
            <Typography
              className={classes.pageInfoHeading}
              variant="h5"
              component="h4"
              gutterBottom
            >
              <label htmlFor="description">Description</label>
            </Typography>
            <EditTextField
              value={data.description}
              onEdit={handleEditDescription}
              multiline
              TextFieldProps={{
                id: 'description',
              }}
            />
          </>
        }
        middleColumn={
          <>
            <ColumnTitle
              title="Sources"
              subtitle="Add sources to gather your social activity from"
            />
            {data.following.map((f) => (
              <FollowItem artistPageId={artistId} follow={f} key={f.id} />
            ))}
            {addDataSource ? (
              <AddActivityCard
                artistId={artistId}
                onSuccess={() => setAddDataSource(false)}
                onCancel={() => setAddDataSource(false)}
              />
            ) : (
              <Button
                className={classes.button}
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddDataSource(true)}
              >
                Add a new data source
              </Button>
            )}
          </>
        }
        rightColumn={
          <>
            <ColumnTitle
              title="Links"
              subtitle="Add personal links that you want to share"
            />
          </>
        }
      />
      <EditArtistPageDialog
        onSuccess={handleEditPage}
        onCancel={() => setEditPage(false)}
        artistPage={editPage ? data : undefined}
      />
    </>
  );
}
