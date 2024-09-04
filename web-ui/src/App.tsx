import { createBrowserRouter, Link, RouteObject, RouterProvider } from "react-router-dom";
import { ReactElement } from "react";

import inventory from "./systems/inventory";
import mapping from "./systems/mapping";
import employee from "./systems/employee";
import promotions from "./systems/promotion";

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
const importedRoutes = [promotions, inventory, mapping, employee];
importedRoutes.forEach((route) => {
  routes.set(route.basePath, {
    path: "/" + route.basePath.toLowerCase(),
    element: route.layout,
    children: route.routes,
  });
});


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
