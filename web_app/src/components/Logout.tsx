import { Button } from '@material-ui/core';
import { useAuthState } from '../providers/AuthProvider';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export const Logout = () => {
  const { csrfToken } = useAuthState();

  return (
    <form action="/auth/logout" method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <Button color="inherit" type="submit">
        Sign out
      </Button>
    </form>
  );
};
