import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface CoverImageProps {
  className?: string;
  src?: string;
}

const useStyles = makeStyles<Theme, CoverImageProps>((theme) => ({
  root: {
    width: '100%',
    height: 240,
    background: (props) =>
      props.src ? `url("${props.src}") no-repeat center` : '#eee',
    backgroundSize: (props) => (props.src ? 'cover' : undefined),
  },
}));

export function CoverImage({
  className,
  children,
  src,
}: PropsWithChildren<CoverImageProps>) {
  const classes = useStyles({ src });
  return <div className={clsx(classes.root, className)}>{children}</div>;
}
