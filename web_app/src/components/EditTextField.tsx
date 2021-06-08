import {
  IconButton,
  makeStyles,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import { useRef, useState } from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';
import { ReactComponent as DeleteIcon } from 'images/delete-icon.svg';

import clsx from 'clsx';
import { EditActions, TextFieldForm } from './TextFieldForm';

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
}));

interface EditTextFieldProps {
  onEdit?: (data: string, done: () => void) => void;
  onDelete?: (done: () => void) => void;
  value?: string;
  singleLine?: boolean;
  multiline?: boolean;
  TextFieldProps?: Omit<TextFieldProps, 'value' | 'onChange'>;
  textClassName?: string;
  validate?: (data: string) => string | undefined;
}

export function EditTextField({
  onEdit,
  onDelete,
  value = '',
  TextFieldProps,
  singleLine,
  multiline = false,
  textClassName,
  validate,
}: EditTextFieldProps) {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  // const [submitting, setSubmitting] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>();

  const handleStartEditing = () => {
    // Ensure the text field starts at the correct height to prevent the page from jumping
    if (textRef.current) {
      setMinHeight(textRef.current.offsetHeight);
    }
    setEditing(true);
  };

  const handleCancel = () => setEditing(false);
  const handleEdit = (value: string, actions: EditActions) => {
    if (onEdit && editing) {
      onEdit(value, () => {
        actions.setSubmitting(false);
        setEditing(false);
      });
    } else {
      actions.setSubmitting(false);
    }
  };
  const handleDelete = () => {
    if (onDelete) {
      onDelete(handleCancel);
    }
  };

  return editing ? (
    <TextFieldForm
      onEdit={handleEdit}
      onCancel={handleCancel}
      initialValue={value}
      TextFieldProps={{
        ...TextFieldProps,
        InputProps: {
          style: { minHeight },
        },
      }}
      multiline={multiline}
      singleLine={singleLine}
      validate={validate}
    />
  ) : (
    <div className={classes.root}>
      <Typography
        onClick={handleStartEditing}
        className={clsx(textClassName, classes.text)}
        component="p"
        ref={textRef}
      >
        {value}
      </Typography>
      <div>
        <IconButton size="small" onClick={handleStartEditing}>
          <EditIcon />
        </IconButton>
        {onDelete && (
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}
