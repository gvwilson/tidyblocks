import { createMuiTheme } from '@material-ui/core/styles'

const TAB_HEIGHT = '34px'
const TAB_WIDTH = '130px'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1C313A',
      light: '#455a64',
      dark: '#000914',
      contrastText: "#ffffff"
    },
    secondary: {
      light: '#2b313a',
      main: '#000914',
      dark: '#000000',
      contrastText: '#ffffff',
    },
  },
  overrides: {
    MuiTabs: {
      root: {
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT
      },
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#b1b4b5'
      }
    },
    MuiTab: {
      root: {
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT,
        minWidth: TAB_WIDTH + " !important",
      },
      wrapper: {
        fontSize: '12px'
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: '#f5f5f5',
        padding: '0px'
      }
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  }
})
