import { createMuiTheme } from '@material-ui/core/styles';

export const appTheme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },
    divider: '#444444',
  },
  typography: {
    h1: {
      fontSize: 48,
      fontWeight: 900,
      letterSpacing: '0em',
    },
    button: {
      textTransform: 'none',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        height: 40,
        borderRadius: 999,
      },
    },
  },
});
