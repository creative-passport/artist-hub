import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 240,
    background: '#eee',
  },
}));

interface CoverImageProps {
  className?: string;
}

export function CoverImage({
  className,
  children,
}: PropsWithChildren<CoverImageProps>) {
  const classes = useStyles();
  return <div className={clsx(classes.root, className)}>{children}</div>;
}
