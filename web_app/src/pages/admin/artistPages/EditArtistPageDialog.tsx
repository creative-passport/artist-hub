import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Dialog } from 'components/Dialog';
import React, { useEffect, useState } from 'react';
import { ArtistPage } from 'types/api-types';

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

interface EditArtistDialogProps {
  onSuccess: (
    data: Partial<ArtistPage>,
    setError: (message: string) => void
  ) => void;
  onCancel: () => void;
  artistPage?: ArtistPage;
}

export default function EditArtistPageDialog({
  onSuccess,
  onCancel,
  artistPage,
}: EditArtistDialogProps) {
  const classes = useStyles();
  const [data, setData] = useState<Partial<ArtistPage>>();
  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (artistPage) {
      setData((data) => (data ? undefined : artistPage));
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [artistPage]);

  const handleExited = () => {
    setData(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((a) => ({ ...a, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data) {
      onSuccess(data, setError);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onCancel}
        fullWidth
        aria-labelledby="form-dialog-title"
        onExited={handleExited}
      >
        {data && (
          <form onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">
              Manage page details
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                className={classes.textField}
                id="title"
                label="Page Title"
                name="title"
                value={data.title}
                onChange={handleChange}
                fullWidth
                required
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
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save changes
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </div>
  );
}
