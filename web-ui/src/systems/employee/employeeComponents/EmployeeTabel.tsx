import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton } from "@mui/material";
import {MoreVert} from '@mui/icons-material';
import { useState } from "react";
import dayjs from "dayjs";

export interface EmployeeData{
    id?: number;
    name?: string;
    role?: string;
    dateOfBirth?: any;
    gender?: string;
    contactNumber?: number;
    email?: string;
    address?: string;
    hireDate?: any;
    basicSalary?: any;
    employmentStatus?: any;
}

const EmployeeTabel  = ({data, query}:{data: EmployeeData[], query: string})=>{
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Contact No.</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact No.</TableCell>
                    <TableCell>Rack Id</TableCell>
                    <TableCell size="medium">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((row: EmployeeData)=>{
                    if(query){
                        return (row.name?.startsWith(query));
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
                        <TableCell key={row.dateOfBirth}>{dayjs(row.dateOfBirth).format('YYYY-MM-DD')}</TableCell>
                        <TableCell key={row.gender}>{row.gender}</TableCell>
                        <TableCell key={row.contactNumber}>{row.contactNumber}</TableCell>
                        <TableCell key={row.email}>{row.email}</TableCell>
                        <TableCell key={row.address}>{row.address}</TableCell>
                        <TableCell key={row.hireDate}>{dayjs(row.hireDate).format('YYYY-MM-DD')}</TableCell>
                        <TableCell key={row.basicSalary}>{row.basicSalary}</TableCell>
                        <TableCell key={row.employmentStatus}>{row.employmentStatus}</TableCell>
                        <TableCell size="medium">
                            <IconButton
                                color='success'
                                size='small'
                                onClick={() => {
                                    // props.setLotModalData(row);
                                    // props.handleLotModalOpen();
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
      </Paper>
  )
}

export default EmployeeTabel