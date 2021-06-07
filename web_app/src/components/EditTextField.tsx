import {
  IconButton,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import { useRef, useState } from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  text: {
    lineHeight: 'normal',
    padding: '6px 0 6px',
  },
  multiline: {
    padding: '6px 0 6px',
    minHeight: 380,
  },
  textField: {
    alignItems: 'flex-start',
  },
}));

interface EditTextFieldProps {
  onEdit?: (data: string, done: () => void) => void;
  value?: string;
  multiline?: boolean;
  TextFieldProps?: Omit<TextFieldProps, 'value' | 'onChange'>;
}

function keyIsEnter(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  if (e.key !== undefined) {
    return e.key === 'Enter';
  }
  if (e.keyCode !== undefined) {
    return e.key === 13;
  }
  return false;
}

export function EditTextField({
  onEdit,
  value = '',
  TextFieldProps,
  multiline = false,
}: EditTextFieldProps) {
  const [editing, setEditing] = useState<string | undefined>();
  const classes = useStyles();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>();

  const handleStartEditing = () => {
    // Ensure the text field starts at the correct height to prevent the page from jumping
    if (textRef.current) {
      setMinHeight(textRef.current.offsetHeight);
    }
    setEditing(value || '');
  };

  const handleCancel = () => setEditing(undefined);
  const handleDone = () => {
    if (onEdit && editing != null) {
      onEdit(editing, handleCancel);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDone();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!multiline && keyIsEnter(e)) {
      e.preventDefault();
    }
  };

  return editing != null ? (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        autoFocus
        multiline
        {...TextFieldProps}
        InputProps={{
          onKeyDown: handleKeyDown,
          className: classes.text,
          classes: { multiline: classes.multiline, root: classes.textField },
          style: { minHeight },
        }}
        onChange={(v) =>
          setEditing(
            multiline ? v.target.value : v.target.value.replaceAll('\n', '')
          )
        }
        value={editing || ''}
      />
      <div>
        <IconButton size="small" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
        <IconButton size="small" onClick={handleDone}>
          <DoneIcon />
        </IconButton>
      </div>
    </form>
  ) : (
    <div className={classes.root}>
      <Typography
        onClick={handleStartEditing}
        className={classes.text}
        component="p"
        ref={textRef}
      >
        {value}
      </Typography>
      <IconButton size="small" onClick={handleStartEditing}>
        <EditIcon />
      </IconButton>
    </div>
  );
}
