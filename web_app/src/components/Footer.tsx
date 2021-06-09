import { Container, Grid, Link, makeStyles } from '@material-ui/core';
import { PropsWithChildren } from 'react';
import { ReactComponent as LogoWhite } from 'images/logo-white.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    flexShrink: 0,
    '& a': {
      textDecoration: 'underline',
    },
  },
  name: {
    fontSize: 18,
    textTransform: 'uppercase',
  },
  footer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderRadius: '32px 32px 0px 0px',
    background: '#222222',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  },
  logoAbout: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  links: {
    flexGrow: 1,
  },
}));

interface FooterLinkProps {
  href: string;
}
function FooterLink({ href, children }: PropsWithChildren<FooterLinkProps>) {
  return (
    <Link href={href} color="inherit">
      {children}
    </Link>
  );
}

export function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <footer className={classes.footer}>
          <div className={classes.logoAbout}>
            <LogoWhite className={classes.logo} />
            <div>
              <FooterLink href="https://www.creativepassport.net/artist-hub/">
                About
                <br />
                <span className={classes.name}>Artist Hub</span>
              </FooterLink>
            </div>
          </div>
          <div className={classes.links}>
            <Grid container>
              <Grid item xs>
                <FooterLink href="https://www.creativepassport.net">
                  The Creative Passport
                </FooterLink>
              </Grid>

              <Grid item xs>
                <FooterLink href="https://github.com/creative-passport/artist-hub">
                  Source code
                </FooterLink>
              </Grid>
            </Grid>
          </div>
        </footer>
      </Container>
    </div>
  );
}
