import { RouteObject } from "react-router-dom";

import MappingPage from "./mapping";

const routes: { name: String; root: React.ReactNode; routes: RouteObject[] } = {
    name: "mapping",
    root: <MappingPage />, // replace with main element
    routes: []
};

export default routes;
