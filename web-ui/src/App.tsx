import { createBrowserRouter, Link, Outlet, RouteObject, RouterProvider } from "react-router-dom";
import { ReactElement } from "react";
import inventory from "./systems/inventory";
import mapping from "./systems/mapping";
import employee from "./systems/employee";
import promotions from "./systems/promotion";
import { DashboardPage, Route } from "./components/DashboardLayout";

let routes: Map<String, RouteObject> = new Map();
let dashBoardTabs:Route[] = [];



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
  let childRoutes = route.routes.map(r => {
    // return copy of route without the display prop.
    r = { ...r };
    delete r['display'];
    return r as RouteObject;
  });

  childRoutes.push({ index: true, element: route.dashboard })
  dashBoardTabs.push(...route.routes.map((r)=>{
    r={...r};
    r.path = route.basePath.toLowerCase()+"/"+r.path;
    return r;
  }));
  routes.set(route.basePath, {
    path: "/" + route.basePath.toLowerCase(),
    element: <Outlet />,
    children: childRoutes,
  });
})

// create router with all loaded routes
const domRouter = createBrowserRouter([{
  path: "/",
  element: <DashboardPage routes={{title: "Test title", basePath:"",routes:dashBoardTabs , dashboard: <></>}} />,
  children : [...routes.values()],
},

]);

const App = () => {
  return <RouterProvider router={domRouter} />
}

export default App
