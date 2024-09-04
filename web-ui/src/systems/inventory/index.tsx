import Dashboard from "./Dashboard";
import { SystemRoutes } from "../../components/DashboardLayout";
import { People } from "@mui/icons-material";
import Page1 from "./Page1";

export const routes: SystemRoutes = {
    title: "Inventory Manager",
    basePath: "inventory",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Page1 />,
            path: "page1",
            display: {
                title: "Inventory Page 1",
                icon: <People />
            }
        }
    ]
};

export default routes;