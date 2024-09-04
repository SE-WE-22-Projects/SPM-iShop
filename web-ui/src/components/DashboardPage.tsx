import { Box, Card, Drawer, List } from '@mui/material';
import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom'
import Nav from './Nav';


const drawerWidth = 275;

const DashboardPage = (props: { children: ReactElement[], title?: string }) => {
    return (
        <>
            <Nav title={props.title} />
            <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }} >
                <Drawer variant="permanent"
                    elevation={0}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth, boxSizing: 'border-box',
                            mt: "64px", position: "fixed"
                        },
                        mb: 'auto'
                    }}>
                    <List className='sidebar'>
                        {props.children}
                    </List>
                </Drawer>
                <Card variant="outlined" sx={{
                    m: "24px",
                    mb: "0px",
                    px: "20px",
                    py: "40px",
                    width: "100%",
                    minHeight: "100%"
                }}>

                    <Box sx={{}}>
                        <Outlet />
                    </Box>
                </Card>
            </Box >
        </>
    )
};

export default DashboardPage;
