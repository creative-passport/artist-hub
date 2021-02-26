import { Container } from '@material-ui/core';
import { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <Container maxWidth="md">
      <div>{children}</div>
    </Container>
  );
}
