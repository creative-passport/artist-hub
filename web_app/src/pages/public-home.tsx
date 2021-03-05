import { Login } from '../components/Login';
import { Typography } from '@material-ui/core';

export function PublicHome() {
  return (
    <div>
      <Typography component="h1" variant="h2">
        Welcome to the Artist Hub
      </Typography>

      <Login />
    </div>
  );
}
