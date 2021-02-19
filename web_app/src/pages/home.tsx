import { Ping } from '../components/Ping';
import { useAuthState } from '../providers/AuthProvider';

export function Home() {
  const { signedIn, csrfToken } = useAuthState();
  return (
    <div>
      <h1>Welcome to the Creative Passport Artist Fan Pages</h1>
      {signedIn ? (
        <>
          <p>Signed in</p>
          <Ping />
          <form action="/auth/logout" method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <input type="submit" value="Sign out" />
          </form>
        </>
      ) : (
        <div>
          <form action="/auth/login" method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <input type="submit" value="Sign in using Creative Passport" />
          </form>
          <p>
            To create your fan page you should first{' '}
            <a href="https://app.creativepassport.net">
              sign up to the Creative Passport
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
