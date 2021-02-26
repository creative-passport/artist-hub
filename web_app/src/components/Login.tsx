import { Button, makeStyles, TextField } from '@material-ui/core';
import { useAuthState } from '../providers/AuthProvider';

const useStyles = makeStyles((theme) => ({
  localForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const Login = () => {
  const { csrfToken, mode, oidc } = useAuthState();
  const classes = useStyles();

  return mode === 'local' ? (
    <div>
      <form action="/auth/login" method="POST" className={classes.localForm}>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div>
          <TextField id="username" label="Username" name="username" />
        </div>
        <div>
          <TextField id="password" label="Password" name="password" />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
          Sign in
        </Button>
      </form>
    </div>
  ) : mode === 'oidc' ? (
    <div>
      <form action="/auth/login" method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
          Sign in using {oidc?.providerName}
        </Button>
      </form>
      {oidc?.helpText && (
        <p
          dangerouslySetInnerHTML={{
            __html: oidc.helpText,
          }}
        />
      )}
    </div>
  ) : null;
};
