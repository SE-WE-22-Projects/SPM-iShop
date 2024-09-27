import Dashboard from "./Dashboard";
import { SystemRoutes } from "../../components/DashboardLayout";
import Page1 from "./Employee";
import { People } from "@mui/icons-material";

export const routes: SystemRoutes = {
    title: "Employee Manager",
    basePath: "employee",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Page1 />,
            path: "manageemployee",
            display: {
                title: "Employee Management",
                icon: <People />
            }
        }
    ]
};

export default routes;