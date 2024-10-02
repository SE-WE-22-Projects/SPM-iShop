import { Map, People, ViewQuilt } from "@mui/icons-material";
import { SystemRoutes } from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Page1 from "./Page1";
import MapEditor from "./MapEditor";
import Section from "./Section";


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
        },
        {
            element: <MapEditor />,
            path: "map",
            display: {
                title: "Map Editor",
                icon: <Map />
            }
        },
        {
            element: <Section />,
            path: "section",
            display: {
                title: "Section Management",
                icon: <ViewQuilt />
            }
        }
    ]
};

export default routes;