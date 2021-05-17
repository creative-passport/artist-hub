import { makeStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});

type CenterProps = React.HTMLAttributes<HTMLDivElement>;

export function Center({
  children,
  className,
  ...rest
}: PropsWithChildren<CenterProps>) {
  const classes = useStyles();
  return (
    <div className={classes.root} {...rest}>
      <div className={className}>{children}</div>
    </div>
  );
}
