import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useArtistPage } from '../../hooks/useArtistPage';

export function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const { isLoading, data } = useArtistPage(username);

  if (isLoading || !data) return <div>Loading</div>;

  return (
    <div>
      <Typography component="h2" variant="h3">
        {data.title}
      </Typography>
      <p>TODO - Show data sources here.</p>
    </div>
  );
}
