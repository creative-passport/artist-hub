import {
  IconButton,
  makeStyles,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  text: {
    lineHeight: 'normal',
    padding: '6px 0 6px',
    width: '100%',
  },
  multiline: {
    padding: '6px 0 6px',
    minHeight: 380,
  },
  textField: {
    alignItems: 'flex-start',
  },
}));

function keyIsEnter(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  if (e.key !== undefined) {
    return e.key === 'Enter';
  }
  if (e.keyCode !== undefined) {
    return e.key === 13;
  }
  return false;
}

export interface EditActions {
  setSubmitting: (submitting: boolean) => void;
  setError: (message: string) => void;
}

interface TextFieldFormProps {
  onEdit?: (data: string, actions: EditActions) => void;
  onCancel?: () => void;
  initialValue?: string;
  singleLine?: boolean;
  multiline?: boolean;
  TextFieldProps?: Omit<TextFieldProps, 'value' | 'onChange'>;
  validate?: (data: string) => string | undefined;
}

export function TextFieldForm({
  onEdit,
  onCancel,
  initialValue = '',
  TextFieldProps: { InputProps, ...TextFieldProps } = {},
  singleLine,
  multiline = false,
  validate,
}: TextFieldFormProps) {
  const classes = useStyles();
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = (value: string) => {
    if (validate) {
      const error = validate(value);
      setError(error);
      return error == null;
    } else {
      return true;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue(multiline ? e.target.value : e.target.value.replaceAll('\n', ''));
    isValid(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!singleLine && !multiline && keyIsEnter(e)) {
      e.preventDefault();
    }
  };
  const handleDone = () => {
    if (onEdit) {
      setTouched(true);
      if (isValid(value)) {
        setSubmitting(true);
        onEdit(value, { setSubmitting, setError });
      }
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDone();
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        autoFocus
        multiline={!singleLine}
        {...TextFieldProps}
        disabled={submitting}
        error={touched && error != null}
        helperText={touched ? error : undefined}
        InputProps={{
          ...InputProps,
          onKeyDown: handleKeyDown,
          className: classes.text,
          classes: { multiline: classes.multiline, root: classes.textField },
        }}
        onBlur={() => setTouched(true)}
        onChange={handleChange}
        value={value}
      />
      <div>
        <IconButton size="small" onClick={onCancel} disabled={submitting}>
          <CloseIcon />
        </IconButton>
        <IconButton size="small" onClick={handleDone} disabled={submitting}>
          <DoneIcon />
        </IconButton>
      </div>
    </form>
  );
}
