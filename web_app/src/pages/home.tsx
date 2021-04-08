import { Typography } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export function Home() {
  return (
    <div>
      <Typography component="h1" variant="h2">
        Artist Hub
      </Typography>
      <Link component={RouterLink} to="/admin/artistpages">
        Manage artist pages
      </Link>
    </div>
  );
}
