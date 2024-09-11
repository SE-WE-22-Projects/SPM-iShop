import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchBar from "../../common/SearchBar";
import { Add } from "@mui/icons-material";
import EmployeeTabel, { EmployeeData } from "./employeeComponents/EmployeeTabel";
import AddEmployeeeModel, { EmpAddData } from "./employeeComponents/AddEmployeeeModel";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

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

    // add employee 
    const addEmployee = async (empData: EmpAddData)=>{
        // api call
        try{
            console.log(empData);
            await axios.post("api/employee/employee",empData);
            enqueueSnackbar("Employee added successfuly...", {variant:  "success"});
            employeeAddModalClose();
            getEmployee();
        }
        catch(e){
            enqueueSnackbar("failed to add employee...", {variant: "error"});
            console.error(e);
        }
    }

    // get Employee
    const [empList,setEmpList] = useState<EmployeeData[]>([]);
    const getEmployee = async ()=>{
        const res = await axios.get("api/employee/employee");
        setEmpList(res.data);
    }

    useEffect(()=>{
        getEmployee();
    },[]);

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
            <EmployeeTabel data={empList} query={searchQuery} />
            <AddEmployeeeModel employeeAddModalClose={employeeAddModalClose} open={addOpen} addEmployee={addEmployee} />
        </div>
    )
}

export default Employee;