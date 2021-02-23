import { Ping } from '../components/Ping';
import { useAuthState } from '../providers/AuthProvider';
import { Login } from '../components/Login';

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
        <Login />
      )}
    </div>
  );
}
