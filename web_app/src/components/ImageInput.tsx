import { Button, makeStyles } from '@material-ui/core';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  preview: {
    display: 'block',
    maxWidth: 200,
    maxHeight: 200,
  },
}));

interface ImageInputProps {
  id: string;
  buttonText?: string;
  onFileChange: (file: File) => void;
  currentImage?: string;
  newImage?: File;
}

export function ImageInput({
  id,
  buttonText = 'Upload',
  onFileChange,
  currentImage,
  newImage,
}: ImageInputProps) {
  const classes = useStyles();
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileChange(file);
    }
  };

  useEffect(() => {
    if (newImage) {
      const fr = new FileReader();
      fr.onload = () =>
        setPreview(fr.result ? (fr.result as string) : undefined);
      fr.readAsDataURL(newImage);
      return () => {
        fr.onload = null;
      };
    } else {
      setPreview(undefined);
    }
  }, [newImage]);

  return (
    <div className={classes.root}>
      <input
        ref={inputRef}
        accept="image/*"
        className={classes.input}
        id={id}
        type="file"
        onChange={handleChange}
      />
      {preview && (
        <img
          src={preview}
          alt="Upload preview"
          onClick={() => inputRef.current?.click()}
          className={classes.preview}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        component="span"
        size="small"
        onClick={() => inputRef.current?.click()}
      >
        {buttonText}
      </Button>
    </div>
  );
}
