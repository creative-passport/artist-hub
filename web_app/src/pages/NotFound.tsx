import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(4),
    textAlign: 'center',
  },
}));

export function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>Page not found</div>
      <div>
        <Link to="/">Return to the homepage</Link>
      </div>
    </div>
  );
}
