import { Box, Card, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom'
import Nav from './Navbar';
import { drawerWidth } from '../config';


export interface SidebarLinkProps {
    /**
     * The url the link redirects to
     */
    url: string
    /**
     * The title text to display for the link
     */
    title: string

    /**
     * An optional icon to display with the link
     */
    icon?: ReactNode
}


/**
 * A link displayed in the sidebar of the page
 * @param props properties for the link @see SidebarLinkProps
 * @returns a new link that can be used in the sidebar
 */
export const SideBarLink = ({ title, url, icon }: SidebarLinkProps) => {
    return <Link to={url}>
        <ListItem disablePadding>
            <ListItemButton>
                {icon ? <ListItemIcon>
                    {icon}
                </ListItemIcon> : null}
                <ListItemText primary={title} />
            </ListItemButton>
        </ListItem>
    </Link>
};

/**
 * Dashboard layout. This is the main page layout that will be used for dashboard pages.
 * Each system must create a component that contains this component and export it in the layout section of the system index.
 * 
 * All child elements inside this tag will be added to the sidebar.
 * @param props 
 * @returns 
 */
const DashboardLayout = (props: { children?: ReactElement[], title?: string }) => {
    return (
        <>
            {/* Nav bar */}
            <Nav title={props.title} />

            {/* Sidebar */}
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

                {/* Page content */}
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

export default DashboardLayout;