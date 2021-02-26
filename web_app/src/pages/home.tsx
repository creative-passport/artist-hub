import { Ping } from '../components/Ping';
import { useAuthState } from '../providers/AuthProvider';
import { Login } from '../components/Login';
import { Button, Typography } from '@material-ui/core';

export function Home() {
  const { signedIn, csrfToken } = useAuthState();
  return (
    <div>
      <Typography component="h1" variant="h2">
        Welcome to the Artist Hub
      </Typography>
      {signedIn ? (
        <>
          <p>Signed in</p>
          <Ping />
          <form action="/auth/logout" method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <Button variant="contained" type="submit">
              Sign out
            </Button>
          </form>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
