import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

const useStyles = makeStyles((theme) => ({
  error: {
    color: 'red',
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& .MuiInputAdornment-positionStart': {
      marginRight: 2,
    },
  },
}));

interface NewArtistDialogProps {
  open: boolean;
  onSuccess: (
    data: Partial<ArtistPage>,
    setError: (message: string) => void
  ) => void;
  onCancel: () => void;
}

export default function NewArtistPageDialog({
  open,
  onSuccess,
  onCancel,
}: NewArtistDialogProps) {
  const classes = useStyles();
  const [newArtist, setNewArtist] = useState<Partial<ArtistPage>>({
    title: '',
    username: '',
  });
  const [error, setError] = useState<string | undefined>();
  const href = window.location.href;
  const pagePrefix = new URL('/p/', href).href;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewArtist((a) => ({ ...a, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(newArtist, setError);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onCancel}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">
            Create New Artist Page
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              className={classes.textField}
              id="title"
              label="Page Title"
              name="title"
              value={newArtist.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              className={classes.textField}
              id="username"
              label="Page “username”"
              name="username"
              value={newArtist.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{pagePrefix}</InputAdornment>
                ),
              }}
              helperText="This is used for the URL and the ActivityPub username for the page"
              fullWidth
            />
            <Typography variant="body2">
              * indicates a required field
            </Typography>
            {error && (
              <DialogContentText className={classes.error}>
                {error}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
