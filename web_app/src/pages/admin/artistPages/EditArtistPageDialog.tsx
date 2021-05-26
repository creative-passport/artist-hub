import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Dialog } from 'components/Dialog';
import { ImageInput } from 'components/ImageInput';
import React, { useEffect, useState } from 'react';
import { ArtistPage, UpdateArtistPage } from 'types/api-types';

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
  imageInputContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
}));

interface EditArtistDialogProps {
  onSuccess: (
    data: UpdateArtistPage,
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
  const [data, setData] = useState<UpdateArtistPage>();
  const [oldProfileImage, setOldProfileImage] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (artistPage) {
      const { profileImage, ...rest } = artistPage;
      setData((data) => (data ? undefined : rest));
      setOldProfileImage(profileImage);
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
    setData((a) => (a ? { ...a, [name]: value } : undefined));
  };

  const handleProfileImage = (file: File) => {
    setData((a) => (a ? { ...a, profileImage: file } : undefined));
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
              <div className={classes.imageInputContainer}>
                <InputLabel htmlFor="avatar-upload">Profile Image</InputLabel>
                <ImageInput
                  id="avatar-upload"
                  onFileChange={handleProfileImage}
                  currentImage={oldProfileImage}
                  newImage={data.profileImage}
                  buttonText="Select image"
                />
              </div>
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
