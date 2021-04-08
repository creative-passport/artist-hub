import { Login } from '../components/Login';
import { Typography } from '@material-ui/core';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

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
