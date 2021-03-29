import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
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
  followContainer: {
    display: 'flex',
  },
  profileLink: {
    flexGrow: 1,
  },
}));

interface AddActivityPubState {
  dataSource: string;
}

interface NewArtistDialogProps {
  open: boolean;
  artistId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Profile {
  id: string;
  name?: string;
  preferredUsername?: string;
  url?: string;
}

export default function AddActivityPubDialog({
  open,
  onSuccess,
  onCancel,
  artistId,
}: NewArtistDialogProps) {
  const classes = useStyles();
  const [state, setState] = useState<AddActivityPubState>({ dataSource: '' });
  const [error, setError] = useState<string | undefined>();
  const [profile, setProfile] = useState<Profile | undefined>();

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
        console.log(result.data);
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
    console.log(`Follow ${profile.id}`);
    axios
      .post(`/api/admin/artistpages/${artistId}/activitypub/follow`, {
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
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">
            Add ActivityPub data source
          </DialogTitle>
          <DialogContent>
            <div className={classes.searchRow}>
              <TextField
                className={classes.dataSourceField}
                autoFocus
                margin="dense"
                id="name"
                label="Data source"
                name="dataSource"
                value={state.dataSource}
                onChange={handleChange}
                helperText="This is usually the URL of the users profile page"
                // fullWidth
              />
              <Button type="submit" color="primary" variant="contained">
                Find profile
              </Button>
            </div>
            {error && (
              <DialogContentText className={classes.error}>
                {error}
              </DialogContentText>
            )}
            {profile && (
              <>
                <div className={classes.followContainer}>
                  <a
                    href={profile.url || profile.id}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.profileLink}
                  >
                    <div>{profile.name}</div>
                    <div>
                      @{profile.preferredUsername}@{hostname}
                    </div>
                  </a>
                  <Button variant="contained" onClick={handleFollow}>
                    Follow
                  </Button>
                </div>
                {/* <pre>
                  <code>{JSON.stringify(profile, undefined, 2)}</code>
                </pre> */}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
