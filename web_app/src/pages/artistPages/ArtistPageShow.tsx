import { Typography } from '@material-ui/core';
import { useReadArtistPage } from '../../hooks/useApi';
import { useParams } from 'react-router-dom';

export function ArtistPageShow() {
  const { artistId } = useParams<{ artistId: string }>();
  const { isLoading, data } = useReadArtistPage(artistId);

  if (isLoading || !data) return <div>Loading</div>;

  return (
    <div>
      <Typography component="h1" variant="h2">
        Artist Pages
      </Typography>
      <Typography component="h2" variant="h3">
        {data.name}
      </Typography>
    </div>
  );
}
