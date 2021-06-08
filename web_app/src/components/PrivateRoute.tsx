import { PropsWithChildren } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from 'providers/AuthProvider';

interface PrivateRouteProps extends React.ComponentProps<typeof Route> {
  renderPublic?: () => React.ReactNode;
}

export function PrivateRoute({
  children,
  renderPublic,
  ...rest
}: PropsWithChildren<PrivateRouteProps>) {
  const { signedIn } = useAuthState();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        signedIn ? (
          children
        ) : renderPublic ? (
          renderPublic()
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
