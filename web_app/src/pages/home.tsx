import { Typography } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <Typography component="h1" variant="h2">
        Artist Hub
      </Typography>
      <Link component={RouterLink} to="/artistpages">
        Manage artist pages
      </Link>
    </div>
  );
}
