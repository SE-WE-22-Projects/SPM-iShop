import { RouteObject } from "react-router-dom";
import PageLayout from "./PageLayout";

const routes: { basePath: String; layout: React.ReactNode; routes: RouteObject[] } = {
    basePath: "promotion",
    layout: <PageLayout />,
    routes: []
};

export default routes;