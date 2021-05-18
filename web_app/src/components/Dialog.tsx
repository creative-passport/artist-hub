import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  makeStyles,
} from '@material-ui/core';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  paper: {
    borderWidth: 4,
    borderStyle: 'solid',
    borderImage:
      'linear-gradient(-90deg, #ff00b4 0%, #82b4dc 49%, #00ffcc 100%) 100% 1 0 1',
  },
});

export function Dialog({
  children,
  ...rest
}: PropsWithChildren<MuiDialogProps>) {
  const classes = useStyles();
  return (
    <MuiDialog
      PaperProps={{ square: true, className: classes.paper }}
      {...rest}
    >
      {children}
    </MuiDialog>
  );
}
