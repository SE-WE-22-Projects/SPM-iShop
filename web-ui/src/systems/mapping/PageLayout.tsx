import DashboardLayout, { SideBarLink } from "../../components/DashboardLayout"
import { Dashboard, People } from "@mui/icons-material"


const PageLayout = () => {
    return <DashboardLayout >
        <SideBarLink title="Dashboard" url="/mapping/" icon={<Dashboard />} />
        <SideBarLink title="Mapping page 1" url="/mapping/page1" icon={<People />} />
    </DashboardLayout>
};

export default PageLayout;