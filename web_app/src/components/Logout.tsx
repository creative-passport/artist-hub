import { Button } from '@material-ui/core';
import { useAuthState } from 'providers/AuthProvider';
import { ReactComponent as LogoutIcon } from 'images/logout.svg';

export const Logout = () => {
  const { csrfToken } = useAuthState();

  return (
    <form action="/auth/logout" method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <Button color="inherit" type="submit" startIcon={<LogoutIcon />}>
        Logout
      </Button>
    </form>
  );
};
