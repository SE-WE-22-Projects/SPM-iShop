import { createTheme } from "@mui/material";

// MUI theme for the site
// TODO: replace with theme colors
export const siteTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1B508B',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

// The width of the sidebar drawer
export const drawerWidth = 275;

// Base url to use for all requests
export const baseURL = "http://localhost:5000/";