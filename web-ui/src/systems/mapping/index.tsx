import { People } from "@mui/icons-material";
import { SystemRoutes } from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Page1 from "./Page1";


export const routes: SystemRoutes = {
    title: "Mapping Manager",
    basePath: "mapping",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Page1 />,
            path: "page1",
            display: {
                title: "Mapping Page 1",
                icon: <People />
            }
        }
    ]
};

export default routes;
