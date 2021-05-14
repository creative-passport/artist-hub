import { Container } from '@material-ui/core';
import { PropsWithChildren } from 'react';
import { useAuthState } from '../providers/AuthProvider';
import { Header } from './Header';
import { Logout } from './Logout';

export function Layout({ children }: PropsWithChildren<{}>) {
  const { signedIn } = useAuthState();

  return (
    <>
      {signedIn && (
        <Header>
          <Logout />
        </Header>
      )}
      <Container maxWidth="md">
        <main>{children}</main>
      </Container>
    </>
  );
}
