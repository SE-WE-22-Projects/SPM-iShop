import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton } from "@mui/material";
import {MoreVert} from '@mui/icons-material';
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import UpdateEmployeeModal from "./UpdateEmployeeModal";

export interface EmployeeData{
    id?: number|null;
    name?: string|null;
    role?: string;
    dateOfBirth?: Dayjs|null;
    gender?: string;
    contactNumber?: number|null;
    email?: string|null;
    address?: string|null;
    hireDate?: Dayjs|null;
    basicSalary?: number|null;
    employmentStatus?: string;
}

const EmployeeTabel  = ({data, query, updateOpen, employeeUpdateModalOpen, employeeUpdateModalClose, updateEmployee, deleteEmployee}:{data: EmployeeData[], query: string, updateOpen: boolean, employeeUpdateModalOpen: ()=>void, employeeUpdateModalClose: ()=>void, updateEmployee: (empData:EmployeeData)=>void, deleteEmployee: (id:number|null)=>void})=>{
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    // item update modal data
    const [updateModalData,setUpdateModalData] = useState<EmployeeData>({});

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Contact No.</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Hire Date</TableCell>
                    <TableCell>Basic salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell size="medium">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((row: EmployeeData)=>{
                    if(query){
                        return (row.name?.toLowerCase()?.startsWith(query));
                    }
                    else{
                        return row;
                    }
                })
                .map((row : EmployeeData) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell key={row.id}>{row.id}</TableCell>
                        <TableCell key={row.name}>{row.name}</TableCell>
                        <TableCell key={row.role}>{row.role}</TableCell>
                        <TableCell >{dayjs(row.dateOfBirth).format('YYYY-MM-DD')}</TableCell>
                        <TableCell key={row.gender}>{row.gender}</TableCell>
                        <TableCell key={row.contactNumber}>{row.contactNumber}</TableCell>
                        <TableCell key={row.email}>{row.email}</TableCell>
                        <TableCell key={row.address}>{row.address}</TableCell>
                        <TableCell >{dayjs(row.hireDate).format('YYYY-MM-DD')}</TableCell>
                        <TableCell key={row.basicSalary}>{row.basicSalary}</TableCell>
                        <TableCell key={row.employmentStatus}>{row.employmentStatus}</TableCell>
                        <TableCell size="medium">
                            <IconButton
                              color='success'
                              size='small'
                              onClick={() => {
                                  setUpdateModalData(row);
                                  employeeUpdateModalOpen();
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <UpdateEmployeeModal open={updateOpen} handleClose={employeeUpdateModalClose} data={updateModalData} updateEmployee={updateEmployee} deleteEmployee={deleteEmployee}/>
      </Paper>
  )
}

export default EmployeeTabel