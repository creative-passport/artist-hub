import { useAuthState } from '../providers/AuthProvider';

export const Login = () => {
  const { csrfToken, mode, oidc } = useAuthState();

  return mode === 'local' ? (
    <div>
      <form action="/auth/login" method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div>
          <label>
            Username <input name="username" />
          </label>
        </div>
        <div>
          <label>
            Password
            <input name="password" />
          </label>
        </div>
        <input type="submit" value="Sign in" />
      </form>
    </div>
  ) : mode === 'oidc' ? (
    <div>
      <form action="/auth/login" method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input type="submit" value={`Sign in using ${oidc?.providerName}`} />
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
