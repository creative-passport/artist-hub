import { makeStyles, Typography } from '@material-ui/core';
import { ReactComponent as NothingLeftImage } from 'images/nothing-left.svg';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text1: {
    color: '#21c2b0',
    fontSize: 24,
    margin: '12px 0 12px',
    fontWeight: 900,
  },
  text2: {
    color: '#777777',
    fontSize: 16,
  },
}));

export function NoMoreContent() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NothingLeftImage />
      <Typography className={classes.text1} variant="inherit">
        It all started here
      </Typography>
      <Typography className={classes.text2} variant="inherit">
        There’s no other content to show on this page
      </Typography>
    </div>
  );
}
