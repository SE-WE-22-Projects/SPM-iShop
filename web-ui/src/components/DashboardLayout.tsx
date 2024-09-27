import { Box, Card, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ReactNode } from 'react';
import { Link, NonIndexRouteObject, Outlet } from 'react-router-dom'
import Nav from './Navbar';
import { drawerWidth, siteTheme } from '../config';
import { Dashboard } from '@mui/icons-material';
import Footer from './Footer';
import bgImg from './componentAssets/blindWalkBg.png';

/**
 * A object that contains all routes in a specific system.
 */
export interface SystemRoutes {
    /**
     * The title of the page. This will be displayed next to the logo image
     */
    title: string;
    /**
     * Base path for all routes. All routes registered in this system will have this path prefixed.
     */
    basePath: string;

    /**
     * The main dashboard page element. This will be displayed when the user first visits the system.
     */
    dashboard: ReactNode

    /**
     * A list of all pages in the system
     */
    routes: Route[];
}

interface Display {
    /**
     * Title to display in the sidebar
     */
    title: string;
    /**
     * An optional icon to display in the sidebar.
     */
    icon?: ReactNode;
}

export interface Route extends NonIndexRouteObject {
    /**
     * Display details for the sidebar. If this is null, this will not be displayed in the sidebar.
     */
    display?: Display;
}



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
    return <Link to={url} style={{ color: siteTheme.palette.text.primary, textDecoration: 'none' }}>
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
 * Dashboard page component. This is the main layout used for all dashboard pages.
 */
export const DashboardPage = ({ routes }: { routes: SystemRoutes }) => {
    return (
        <>
            {/* Nav bar */}
            <Nav title={routes.title} />

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
                        <SideBarLink title="Dashboard" url={routes.basePath ? `/${routes.basePath}/` : `/`} icon={<Dashboard />} />
                        {routes.routes.map((e) => {
                            if (!e.display) return null;
                            return <SideBarLink title={e.display.title} url={routes.basePath ? `/${routes.basePath}/${e.path}` : `/${e.path}`} icon={e.display.icon} />;
                        }
                        )}
                    </List>
                </Drawer>

                {/* Page content */}
                <Card variant="outlined" sx={{
                    m: "24px",
                    mb: "0px",
                    px: "20px",
                    py: "40px",
                    width: "100%",
                    minHeight: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)"
                }}>

                    <Box >
                        <Outlet />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: -2 }}>
                            <div
                                style={{
                                    backgroundImage: `url(${bgImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'left',
                                    opacity: 0.3,
                                    position: 'absolute',
                                    bottom: 10,
                                    left: 135,
                                    width: '50%',
                                    height: '100%',
                                    zIndex: -1,
                                }}
                            />
                            <Footer />
                        </div>
                        
                    </Box>
                </Card>
            </Box >
        </>
    )
}; 