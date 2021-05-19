import { Button, makeStyles } from '@material-ui/core';
import { useAdminReadArtistPage } from 'hooks/useAdminArtistPages';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FollowItem } from './FollowItem';
import { ArtistPageLayout } from 'components/ArtistPageLayout';
import { ColumnTitle } from './ColumnTitle';
import AddIcon from '@material-ui/icons/Add';
import AddActivityCard from './AddActivityCard';

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 16,
    width: '100%',
    textTransform: 'uppercase',
    height: 56,
  },
}));

export function ArtistPageShow() {
  const { artistId } = useParams<{ artistId: string }>();
  const { isLoading, data } = useAdminReadArtistPage(artistId);
  const [addDataSource, setAddDataSource] = useState(false);
  const classes = useStyles();

  if (isLoading || !data) return <div>Loading</div>;

  return (
    <ArtistPageLayout
      title={data.title}
      url={data.url}
      leftColumn={
        <>
          <ColumnTitle
            title="Page info"
            subtitle="Manage the page information"
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
  );
}
