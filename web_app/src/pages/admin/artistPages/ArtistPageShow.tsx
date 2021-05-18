import { Button, Typography } from '@material-ui/core';
import { useAdminReadArtistPage } from 'hooks/useAdminArtistPages';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import AddActivityPubDialog from './AddActivityPubDialog';
import { FollowItem } from './FollowItem';
import { ArtistPageLayout } from 'components/ArtistPageLayout';
import { ColumnTitle } from './ColumnTitle';

export function ArtistPageShow() {
  const { artistId } = useParams<{ artistId: string }>();
  const { isLoading, data } = useAdminReadArtistPage(artistId);
  const [addDataSource, setAddDataSource] = useState(false);

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
