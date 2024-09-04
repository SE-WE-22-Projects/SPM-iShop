import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ConfirmProvider } from 'material-ui-confirm'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import { baseURL, siteTheme } from './config.ts'

export const theme = siteTheme;

axios.defaults.baseURL = baseURL;
axios.interceptors.request.use(async (cfg) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    cfg.headers.Authorization = `Bearer: ${jwt}`;
  }
  return cfg;
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider autoHideDuration={3000} >
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
)
