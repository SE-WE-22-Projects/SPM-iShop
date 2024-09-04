import { RouteObject } from "react-router-dom";
import Dashboard from "./Dashboard";
import Page1 from "./Page1";
import DashboardLayout, { SideBarLink } from "../../components/DashboardLayout";
import { People } from "@mui/icons-material";



const Layout = () => {
    return <DashboardLayout >
        <SideBarLink title="Dashboard" url="/mapping/" icon={<Dashboard />} />
        <SideBarLink title="Mapping page 1" url="/mapping/page1" icon={<People />} />
    </DashboardLayout>
};


const routes: { basePath: String; layout: React.ReactNode; routes: RouteObject[] } = {
    basePath: "mapping",
    layout: <Layout />,
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
