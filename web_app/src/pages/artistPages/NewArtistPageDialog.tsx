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
import React, { useState } from 'react';

const useStyles = makeStyles({
  error: {
    color: 'red',
  },
});

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
  const [newArtist, setNewArtist] = useState<Partial<ArtistPage>>({ name: '' });
  const [error, setError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewArtist((a) => ({ ...a, [name]: value }));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onCancel}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Artist Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Page Name"
            name="name"
            value={newArtist.name}
            onChange={handleChange}
            fullWidth
          />
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
          <Button
            onClick={() => onSuccess(newArtist, setError)}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
