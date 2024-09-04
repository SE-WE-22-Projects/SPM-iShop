import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AccountCircle, ArrowDropDown, Logout } from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// TODO: handle user sessions
const getUser = () => { return { name: "Test User" } };


function TopNavBar(props: { title?: string }) {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };



    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logoutClick = () => {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        if (getUser() === null) navigate("/");
    })

    return <>
        <AppBar position="fixed">
            <Toolbar disableGutters={true} sx={{ px: "8px" }}>
                <Box sx={{ flexGrow: 0 }} onClick={() => { window.location.href = "/" }}>
                    {/* TODO: add logo */}
                    <img src="/assets/logo.png" alt="Logo Image" style={{ height: "50px" }} />
                </Box>
                <Box sx={{ mx: 1 }}>
                    <Typography>{props.title}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Box onClick={handleOpenUserMenu} sx={{ display: "flex" }} id="menu-opener">
                        <IconButton sx={{ p: 0 }}>
                            <AccountCircle sx={{ color: "#ffffff", fontSize: "40px" }}></AccountCircle>
                        </IconButton>
                        <Typography sx={{ color: "#ffffff", my: "auto", ml: 2 }}>{getUser()?.name}</Typography>
                        <ArrowDropDown sx={{ color: "#ffffff", my: "auto", fontSize: "28px" }}></ArrowDropDown>
                    </Box>
                    <Menu
                        sx={{ mt: '45px', mx: '16px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={logoutClick}>
                            <ListItemIcon>
                                <Logout></Logout>
                            </ListItemIcon>
                            <Typography>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        <Toolbar />
    </>;
}
export default TopNavBar;
