import { makeStyles, Typography } from '@material-ui/core';
import { ReactComponent as CreatNewIcon } from 'images/create-new.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #8c8c8c',
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    cursor: 'pointer',
    background: 'transparent',
    height: '100%',
    justifyContent: 'center',
  },
  createNew: {
    fontSize: 20,
    color: '#222222',
    letterSpacing: '0.2em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  text: {
    color: '#777777',
  },
}));

interface CreateNewProps {
  onClick?: () => void;
}

export function CreateNew({ onClick }: CreateNewProps) {
  const classes = useStyles();
  return (
    <button className={classes.root} onClick={onClick}>
      <CreatNewIcon />
      <Typography className={classes.createNew}>Create New</Typography>
      <Typography className={classes.text}>
        Create a page to dispay feeds from different social networks
      </Typography>
    </button>
  );
}
