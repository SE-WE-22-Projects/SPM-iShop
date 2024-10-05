import { Map, People, QrCode, ViewQuilt } from "@mui/icons-material";
import { SystemRoutes } from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Section from "./Section";
import Rack from "./Rack";
import StoreQR from "./StoreQR";

export const routes: SystemRoutes = {
  title: "Mapping Manager",
  basePath: "mapping",

  dashboard: <Dashboard />,
  routes: [
    {
      element: <Section />,
      path: "section",
      display: {
        title: "Section Management",
        icon: <ViewQuilt />,
      },
    },
    {
      element: <Rack />,
      path: "rack",
      display: {
        title: "Rack Management",
        icon: <ViewQuilt />,
      },
    },
    {
      element: <StoreQR />,
      path: "qr",
      display: {
        title: "Store QR",
        icon: <QrCode />,
      },
    },
  ],
};

export default routes;
