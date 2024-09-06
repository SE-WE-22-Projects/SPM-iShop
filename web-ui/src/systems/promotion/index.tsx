import {LocalOffer} from '@mui/icons-material';
import { SystemRoutes } from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Promotion from "./Promotion";


export const routes: SystemRoutes = {
    title: "Promotion Manager",
    basePath: "promotions",

    dashboard: <Dashboard />,
    routes: [
        {
            element: <Promotion />,
            path: "Promotion",
            display: {
                title: "Promotions",
                icon: <LocalOffer />
            }
        }
    ]
};

export default routes;
