import { Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { Dashboard, People } from "@mui/icons-material"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"


const PageLayout = () => {
    return <DashboardLayout >
        <Link to="/mapping/">
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
        </Link>

        <Link to="/mapping/page1">
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <People />
                    </ListItemIcon>
                    <ListItemText primary="Mapping page 1" />
                </ListItemButton>
            </ListItem>
        </Link>
    </DashboardLayout>
};

export default PageLayout;