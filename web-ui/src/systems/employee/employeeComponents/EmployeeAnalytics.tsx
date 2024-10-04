import React from 'react'
import { EmployeeData } from './EmployeeTabel'
import Box from '@mui/material/Box'
import DynamicTable from '../../../common/DynamicTable'
import Typography from '@mui/material/Typography'

const EmployeeAnalytics = ({data}:{data:EmployeeData[]}) => {
    const headers = [
        "Employee ID",
        "Name",
        "Role",
        "Date of Birth",
        "Gender",
        "Contact No.",
        "Email",
        "Address",
        "Hire Date",
        "Basic salary",
        "Status"
    ];

    const columns: (keyof EmployeeData)[] = [
        'id',
        'name',
        'role',
        'dateOfBirth',
        'gender',
        'contactNumber',
        'email',
        'address',
        'hireDate',
        'basicSalary',
        'employmentStatus',
    ];

  return (
    <div>
        <Typography variant="h5" align="center">Role Based Employee Details</Typography>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="All Employee Details" />
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Manager Details" filterAttribute='role' filterValue='Manager'/>
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Assistance Details" filterAttribute='role' filterValue='Assistance' />
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Cashier Details" filterAttribute='role' filterValue='Cashier' />
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Other Employee Details" filterAttribute='role' filterValue='Other' />
        </Box>
        <Typography variant="h5" align="center">Employement Type Based Employee Details</Typography>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Full Time Employee Details" filterAttribute='employmentStatus' filterValue='full-time' />
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Part Time Employee Details" filterAttribute='employmentStatus' filterValue='part-time' />
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} columns={columns} headers={headers} title="Contract Employee Details" filterAttribute='employmentStatus' filterValue='contract' />
        </Box>
    </div>
  )
}

export default EmployeeAnalytics