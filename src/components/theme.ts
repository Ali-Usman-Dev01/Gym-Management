import { createTheme } from '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f7fa',
      paper: '#22223b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#4a4e69',
    },
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#22223b',
          color: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(63,81,181,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px #f5005711',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          backgroundColor: '#f00',
          color: '#000',
        },
        menu: {
          '& .MuiSvgIcon-root': {
            color: '#f50057',
          },
        },
        root: {
          border: '2px solid #4a4e69',
          background: '#22223b',
        },
        footerContainer: {
          backgroundColor: '#f50057',
          color: '#ffffff',
        },
        row: {
          '&.Mui-selected': {
            backgroundColor: '#4a4e69 !important',
            color: '#ffffff !important',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#4a4e69 !important',
            color: '#ffffff !important',
          },
        },
      },
    },
  },
});

export default theme;
