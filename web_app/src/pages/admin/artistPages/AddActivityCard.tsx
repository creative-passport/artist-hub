import {
  Box,
  Button,
  Divider,
  fade,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useAdminFollow } from 'hooks/useFollow';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#444444',
    border: `1px solid ${fade('#444444', 0.5)}`,
    borderRadius: 16,
    width: '100%',
    padding: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'baseline',
  },
  dataSourceField: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  name: {
    fontSize: 16,
    color: '#222222',
    fontWeight: 'bold',
  },
  dataSourceLink: {
    marginRight: theme.spacing(1),
    fontSize: 12,
  },
  followContainer: {
    background: '#eeeeee',
    borderRadius: 16,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    '& > hr': {
      margin: '16px 0',
    },
  },
  foundProfileRow: {
    display: 'flex',
    alignItems: 'center',
  },
  // profileLink: {
  //   flexGrow: 1,
  // },
  checkIcon: {
    margin: theme.spacing(1),
  },
}));

interface AddActivityPubState {
  dataSource: string;
}

interface NewArtistDialogProps {
  artistId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Profile {
  id: string;
  name?: string;
  preferredUsername?: string;
  url?: string;
  iconUrl?: string;
}

export default function AddActivityCard({
  onSuccess,
  onCancel,
  artistId,
}: NewArtistDialogProps) {
  const classes = useStyles();
  const [state, setState] = useState<AddActivityPubState>({ dataSource: '' });
  const [error, setError] = useState<string | undefined>();
  const [profile, setProfile] = useState<Profile | undefined>();
  const rootEl = useRef<HTMLDivElement>(null);
  const follow = useAdminFollow(artistId);

  // Scroll into view on initial display
  useEffect(() => {
    rootEl.current?.scrollIntoView();
  }, []);

  // Scroll into view when the profile is populated
  useEffect(() => {
    if (profile) {
      rootEl.current?.scrollIntoView();
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((a) => ({ ...a, [name]: value }));
  };

  const clearForm = () => {
    setProfile(undefined);
    setError(undefined);
    setState({ dataSource: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    setError(undefined);
    e.preventDefault();
    axios
      .post('/api/admin/activitypub/lookup', {
        url: state.dataSource,
      })
      .then((result) => {
        setProfile(result.data);
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  const handleFollow = () => {
    if (!profile) {
      return;
    }
    follow
      .mutateAsync({
        id: profile.id,
      })
      .then(() => {
        onSuccess();
        clearForm();
      });
  };

  let hostname = '';
  if (profile && profile.id) {
    const url = new URL(profile.id);
    hostname = url.hostname;
  }

  return (
    <div className={classes.root} ref={rootEl}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">Add ActivityPub data source</Typography>
        <Typography variant="body2" color="textSecondary">
          Give us a source to gather your social activity from. This is usually
          the URL of your profile page on that network (e.g. Mastodon, Peertube)
        </Typography>
        <div>
          <div className={classes.searchRow}>
            <TextField
              className={classes.dataSourceField}
              autoFocus
              margin="dense"
              id="name"
              // label="Data source"
              name="dataSource"
              value={state.dataSource}
              onChange={handleChange}
              helperText="This is usually the URL of the users profile page"
              // fullWidth
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
            >
              Find profile
            </Button>
          </div>
          {error && <div className={classes.error}>{error}</div>}
          {profile && (
            <>
              <div className={classes.followContainer}>
                <div className={classes.foundProfileRow}>
                  <CheckCircleIcon className={classes.checkIcon} />
                  <div>
                    <Typography className={classes.name}>
                      {profile.name}
                    </Typography>
                    <Link
                      href={profile.url || profile.id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.dataSourceLink}
                      underline="hover"
                      color="textSecondary"
                    >
                      @{profile.preferredUsername}@{hostname}
                    </Link>
                  </div>
                </div>
                <Divider />
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Posts from this source shared from today onwards will be
                  displayed on your page.
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleFollow}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </div>
            </>
          )}
        </div>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={handleCancel} color="primary" size="small">
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
}
