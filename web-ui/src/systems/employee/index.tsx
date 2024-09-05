import Dashboard from "./Dashboard";
import { SystemRoutes } from "../../components/DashboardLayout";
import Page1 from "./Page1";
import { People } from "@mui/icons-material";

export const routes: SystemRoutes = {
    title: "Employee Manager",
    basePath: "employee",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Page1 />,
            path: "page1",
            display: {
                title: "Employee Page 1",
                icon: <People />
            }
        }
    ]
};

export default routes;