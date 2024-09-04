import { Link } from "react-router-dom"
import DashboardPage from "../../components/DashboardPage"
import { Dashboard, People } from "@mui/icons-material"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"


const MappingPage = () => {
    return <DashboardPage >
        <Link to="/icms/">
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
        </Link>

        <Link to="/icms/patient">
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <People />
                    </ListItemIcon>
                    <ListItemText primary="Patient Management" />
                </ListItemButton>
            </ListItem>
        </Link>

    </DashboardPage>
};

export default MappingPage;