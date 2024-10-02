import Dashboard from "./Dashboard";
import { SystemRoutes } from "../../components/DashboardLayout";
import { Inventory, MoveUp } from "@mui/icons-material";
import Item from "./Item";
import ItemAllocation from "./ItemAllocation";

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
        },
        {
            element: <ItemAllocation />,
            path: "allocation",
            display: {
                title: "Item Allocation",
                icon: <MoveUp />
            }
        }
    ]
};

export default routes;