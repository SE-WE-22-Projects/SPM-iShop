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

// set the base url used for all axios requests.
axios.defaults.baseURL = baseURL;

// setup axios interceptor to handle injecting the auth token into requests.
axios.interceptors.request.use(async (cfg) => {
  const jwt = localStorage.getItem("auth");
  if (jwt) {
    cfg.headers.Authorization = `Bearer: ${jwt}`;
  }
  return cfg;
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={siteTheme}>
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
