import { createBrowserRouter, RouterProvider } from "react-router-dom";
import inventory from "./systems/inventory";
import mapping from "./systems/mapping";
import employee from "./systems/employee";
import promotions from "./systems/promotion";
import { DashboardPage, Route } from "./components/DashboardLayout";
import Login from "./Login";
import Home from "./systems/Home";

let dashBoardTabs: Route[] = [];

// load all routes from the systems into the routes map
const importedRoutes = [promotions, inventory, employee, mapping];
importedRoutes.forEach((route) => {
  dashBoardTabs.push(...route.routes.map((r) => {
    r = { ...r };
    r.path = route.basePath.toLowerCase() + "/" + r.path;
    return r;
  }));
})

// create router with all loaded routes
const domRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/sys",
    element: <DashboardPage routes={{ title: "VisionGuide", basePath: "sys", routes: dashBoardTabs, dashboard: <Home/>}} />,
    children: [...dashBoardTabs, {element: <Home/>, index: true}],
  }
]);

const App = () => {
  return <RouterProvider router={domRouter} />
}

export default App
