import Dashboard from "./Dashboard";
import { SystemRoutes } from "../../components/DashboardLayout";
import { Inventory } from "@mui/icons-material";
import Item from "./Item";

export const routes: SystemRoutes = {
    title: "Inventory Manager",
    basePath: "inventory",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Item />,
            path: "items",
            display: {
                title: "Items",
                icon: <Inventory />
            }
        }
    ]
};

export default routes;