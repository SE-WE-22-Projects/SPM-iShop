import { createBrowserRouter, Link, RouteObject, RouterProvider } from "react-router-dom";
import { ReactElement } from "react";

import inventory from "./systems/inventory";
import mapping from "./systems/mapping";
import employee from "./systems/employee";
import promotions from "./systems/promotion";
import { DashboardPage } from "./components/DashboardLayout";

let routes: Map<String, RouteObject> = new Map();



/**
 * Temporary main page that lists all subsystems
 */
function TempMain() {
  let links: ReactElement[] = [];
  routes.forEach((v, k) => {
    links.push(
      <div>
        <Link to={v.path!}>{k}</Link>
      </div>
    );
  });

  return links;
}


// load all routes from the systems into the routes map
const importedRoutes = [promotions, inventory, employee, mapping];
importedRoutes.forEach((route) => {
  routes.set(route.basePath, {
    path: "/" + route.basePath.toLowerCase(),
    element: <DashboardPage routes={route} />,
    children: route.routes.map(r => {
      return {
        path: r.path,
        element: r.element,
        children: r.children
      } as RouteObject;
    }),
  });
})

// create router with all loaded routes
const domRouter = createBrowserRouter([{
  path: "/",
  element: <TempMain />
},
...routes.values(),
]);

const App = () => {
  return <RouterProvider router={domRouter} />
}

export default App
