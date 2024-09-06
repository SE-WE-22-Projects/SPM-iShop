import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import SearchBar from "../../common/SearchBar";
import { Add } from "@mui/icons-material";
import EmployeeTabel from "./employeeComponents/EmployeeTabel";

const Employee = () => {
    // real time search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const search = (str: string)=>{
        setSearchQuery(str);
    }
    // handle add employee modal
    const [addOpen, setAddOpen] = useState(false);
    const employeeAddModalOpen = () => setAddOpen(true);
    const employeeAddModalClose = () => setAddOpen(false);

    return (
        <div>
            <Typography variant="h3" align="center"> Item Management</Typography>
            <Box sx={{ display: "flex" }} my={2} mx={15} >
                <SearchBar onSearch={search} />
                <Box flexGrow={1}></Box> 
                <Button variant="outlined" startIcon={<Add />} onClick={employeeAddModalOpen} >
                    Add Employee
                </Button>
            </Box>
            <EmployeeTabel data={[]} query={searchQuery} />
        </div>
    )
}

export default Employee;