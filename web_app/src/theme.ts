import { createMuiTheme, fade } from '@material-ui/core/styles';

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
      letterSpacing: 'normal',
    },
    h4: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#444444',
    },
    // Used by dialog titles
    h6: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#444444',
    },
    button: {
      fontWeight: 400,
      textTransform: 'none',
      letterSpacing: 'normal',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        minHeight: 40,
        borderRadius: 999,
      },
      text: {
        padding: '6px 24px',
      },
      contained: {
        padding: '5px 24px',
      },
      outlined: {
        padding: '5px 24px',
      },
      containedPrimary: {
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#444444',
        '&:hover': {
          backgroundColor: '#000000',
          '@media (hover: none)': {
            backgroundColor: '#444444',
          },
        },
      },
      outlinedPrimary: {
        color: '#444444',
        border: `1px solid ${fade('#444444', 0.5)}`,
        '&:hover': {
          border: `1px solid #444444`,
          backgroundColor: fade('#444444', 0.04),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiDialogActions: {
      root: {
        '& > *': {
          flexGrow: 1,
        },
        padding: '16px 24px',
      },
    },
    MuiDialogTitle: {
      root: {},
    },
  },
  props: {
    MuiButton: {
      color: 'primary',
      variant: 'outlined',
      disableElevation: true,
    },
  },
});
