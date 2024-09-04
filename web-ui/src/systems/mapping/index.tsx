import { RouteObject } from "react-router-dom";
import PageLayout from "./PageLayout";
import Dashboard from "./Dashboard";
import Page1 from "./Page1";


const routes: { basePath: String; layout: React.ReactNode; routes: RouteObject[] } = {
    basePath: "mapping",
    layout: <PageLayout />,
    routes: [
        {
            index: true,
            element: <Dashboard />
        },
        {
            element: <Page1 />,
            path: "page1"
        }
    ]
};

export default routes;
