import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchBar from "../../common/SearchBar";
import { Add } from "@mui/icons-material";
import EmployeeTabel, { EmployeeData } from "./employeeComponents/EmployeeTabel";
import AddEmployeeeModel, { EmpAddData } from "./employeeComponents/AddEmployeeeModel";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useConfirm } from 'material-ui-confirm';
import PageLoader from "../../common/PageLoader";

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

    // handle update employee modal
    const [updateOpen, setUpdateOpen] = useState(false);
    const employeeUpdateModalOpen = () => setUpdateOpen(true);
    const employeeUpdateModalClose = () => setUpdateOpen(false);

    // add employee 
    const addEmployee = async (empData: EmpAddData)=>{
        // data validation
        if(!empData.name){
            enqueueSnackbar("Employee name is required...", {variant:  "error"});
            return;
        }
        else if(!empData.role){
            enqueueSnackbar("Employee role is required...", {variant:  "error"});
            return;
        }
        else if(!empData.dateOfBirth){
            enqueueSnackbar("Employee birth date is required...", {variant:  "error"});
            return;
        }
        else if(!empData.gender){
            enqueueSnackbar("Employee gender is required...", {variant:  "error"});
            return;
        }
        else if(!empData.contactNumber){
            enqueueSnackbar("Employee contact number is required...", {variant:  "error"});
            return;
        }
        else if(!empData.email){
            enqueueSnackbar("Employee email is required...", {variant:  "error"});
            return;
        }
        else if(!empData.address){
            enqueueSnackbar("Employee address is required...", {variant:  "error"});
            return;
        }
        else if(!empData.hireDate){
            enqueueSnackbar("Employee hire date is required...", {variant:  "error"});
            return;
        }
        else if(!empData.basicSalary){
            enqueueSnackbar("Employee basic salary is required...", {variant:  "error"});
            return;
        }
        else if(empData.basicSalary < 0){
            enqueueSnackbar("Employee basic salary should be positive...", {variant:  "error"});
            return;
        }
        else if(!empData.employmentStatus){
            enqueueSnackbar("Employee status is required...", {variant:  "error"});
            return;
        }
        //api call
        try{
            await axios.post("api/employee/employee",empData);
            enqueueSnackbar("Employee added successfuly...", {variant:  "success"});
            employeeAddModalClose();
            getEmployees();
        }
        catch(e){
            enqueueSnackbar("failed to add employee...", {variant: "error"});
            console.error(e);
        }
    }

    // get Employee
    const [empList,setEmpList] = useState<EmployeeData[]>([]);
    const getEmployees = async ()=>{
        const res = await axios.get("api/employee/employee");
        setEmpList(res.data);
    }

    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        getEmployees();
        setTimeout(()=>setIsLoading(false),1000);
    },[]);

    // confirm box handle
    const confirm = useConfirm();

    // update employee
    const updateEmployee = (empData: EmployeeData)=>{
        // data validation
        if(!empData.name){
            enqueueSnackbar("Employee name is required...", {variant:  "error"});
            return;
        }
        else if(!empData.role){
            enqueueSnackbar("Employee role is required...", {variant:  "error"});
            return;
        }
        else if(!empData.dateOfBirth){
            enqueueSnackbar("Employee birth date is required...", {variant:  "error"});
            return;
        }
        else if(!empData.gender){
            enqueueSnackbar("Employee gender is required...", {variant:  "error"});
            return;
        }
        else if(!empData.contactNumber){
            enqueueSnackbar("Employee contact number is required...", {variant:  "error"});
            return;
        }
        else if(!empData.email){
            enqueueSnackbar("Employee email is required...", {variant:  "error"});
            return;
        }
        else if(!empData.address){
            enqueueSnackbar("Employee address is required...", {variant:  "error"});
            return;
        }
        else if(!empData.hireDate){
            enqueueSnackbar("Employee hire date is required...", {variant:  "error"});
            return;
        }
        else if(!empData.basicSalary){
            enqueueSnackbar("Employee basic salary is required...", {variant:  "error"});
            return;
        }
        else if(empData.basicSalary < 0){
            enqueueSnackbar("Employee basic salary should be positive...", {variant:  "error"});
            return;
        }
        else if(!empData.employmentStatus){
            enqueueSnackbar("Employee status is required...", {variant:  "error"});
            return;
        }
        confirm( {description: "Confirm Employee Item Details"})
        .then(
            async ()=>{
                try{
                    await axios.put(`api/employee/employee/${empData.id}`,empData);
                    enqueueSnackbar("Employee updated successfuly...", {variant:  "success"});
                    employeeUpdateModalClose();
                    getEmployees();
                }
                catch(e){
                    enqueueSnackbar("failed to update item...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            employeeUpdateModalClose();
        })
    }

    const deleteEmployee = (id:number|null)=>{
        confirm( {description: "Confirm Delete Employee Details"})
        .then(
            async ()=>{
                try{
                    await axios.delete(`api/employee/employee/${id}`);
                    enqueueSnackbar("Employee deleted successfuly...", {variant:  "success"});
                    employeeUpdateModalClose();
                    getEmployees();
                }
                catch(e){
                    enqueueSnackbar("failed to delete employee...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            employeeUpdateModalClose();
        })
    }


    return (
        <div>
            {isLoading ? <PageLoader /> :
                <div>
                    <Typography variant="h3" align="center"> Employee Management</Typography>
                    <Box sx={{ display: "flex" }} my={2} mx={15} >
                        <SearchBar onSearch={search} />
                        <Box flexGrow={1}></Box>
                        <Button variant="outlined" startIcon={<Add />} onClick={employeeAddModalOpen} >
                            Add Employee
                        </Button>
                    </Box>
                    <EmployeeTabel data={empList} query={searchQuery} updateOpen={updateOpen} employeeUpdateModalOpen={employeeUpdateModalOpen} employeeUpdateModalClose={employeeUpdateModalClose} updateEmployee={updateEmployee} deleteEmployee={deleteEmployee} />
                    <AddEmployeeeModel employeeAddModalClose={employeeAddModalClose} open={addOpen} addEmployee={addEmployee} />
                </div>
            }
        </div>
    )
}

export default Employee;