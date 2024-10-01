import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Button, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Cancel, Edit } from '@mui/icons-material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  height: '850px',
  p: 4,
  // overflow: 'auto'
};

export interface EmpAddData{
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
const AddEmployeeeModel = ({employeeAddModalClose,open,addEmployee}:{employeeAddModalClose:()=>void, open: boolean, addEmployee: (empData: EmpAddData)=>void})=>{
  // states for add employee
  const [name,setName] = useState<string|null>();
  const [role,setRole] = useState<string>("Manager");
  const [dateOfBirth,setDateOfBirth] = useState<Dayjs|null>();
  const [gender,setGender] = useState<string>("male");
  const [contactNumber,setContactNumber] = useState<number|null>();
  const [email,setEmail] = useState<string|null>();
  const [address,setAddress] = useState<string|null>();
  const [hireDate,setHireDate] = useState<Dayjs|null>();
  const [basicSalary,setBasicSalary] = useState<number|null>();
  const [employmentStatus,setEmploymentStatus] = useState<string>("full-time");

  return (
    <div>
      <Modal
        open={open}
        onClose={employeeAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add new Employee
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 3, width: '55ch' },
              }}
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                addEmployee({ name, role, dateOfBirth, gender, contactNumber, email, address, hireDate, basicSalary, employmentStatus });
                // clear states
                setName(null);
                setRole("Manager");
                setDateOfBirth(null);
                setGender("male");
                setContactNumber(null);
                setEmail(null);
                setAddress(null);
                setHireDate(null);
                setBasicSalary(null);
                setEmploymentStatus("full-time");
              }}
            >
              <Stack direction="row" spacing={10}>
                <Box>
                  <TextField id="outlined-basic1" label="Employee Name" variant="outlined" name="name" onChange={(e) => setName(e.target.value)} />
                </Box>
                <Box>
                  <TextField
                    id="outlined-select3"
                    name="role"
                    select
                    label="Role"
                    defaultValue="Manager"
                    helperText="Please select role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value={"Manager"}>
                      Manager
                    </MenuItem>
                    <MenuItem value={"Assistance"}>
                      Assistance
                    </MenuItem>
                    <MenuItem value={"Cashier"}>
                      Cashier
                    </MenuItem>
                    <MenuItem value={"Other"}>
                      Other
                    </MenuItem>
                  </TextField>
                </Box>
              </Stack>
              <Stack direction="row" spacing={10}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker label="Birth Date" onChange={(val) => setDateOfBirth(val)} maxDate={dayjs()} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <Box>
                 <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={"male"}
                  name="gender"
                  onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value={"male"} control={<Radio />} label="Male" />
                    <FormControlLabel value={"female"} control={<Radio />} label="Female" />
                  </RadioGroup>
                </Box>
                
              </Stack>
              <Stack direction="row" spacing={10}>
                <Box>
                  <TextField type="number" id="outlined-basic2" label="Contact No" variant="outlined" name="contactNumber" onChange={(e) => setContactNumber(Number.parseInt(e.target.value))} />
                </Box>
                <Box>
                  <TextField type="email" id="outlined-basic2" label="Email" variant="outlined" name="email" onChange={(e) => setEmail(e.target.value)} />
                </Box>
              </Stack>

              <Box>
                <TextField type="text" id="outlined-basic2" label="Address" variant="outlined" name="address" onChange={(e) => setAddress(e.target.value)} />
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker label="Hire Date" onChange={(val) => setHireDate(val)} maxDate={dayjs()} />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box>
                <TextField type="number" id="outlined-basic2" label="Basic Salary" variant="outlined" name="basicSalary" onChange={(e) => setBasicSalary(Number.parseInt(e.target.value))} />
              </Box>
              <FormLabel id="demo-radio-buttons-group-label">Employement Status</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={"full-time"}
                name="employmentStatus"
                onChange={(e) => setEmploymentStatus(e.target.value)}
              >
                <FormControlLabel value={"full-time"} control={<Radio />} label="full-time" />
                <FormControlLabel value={"part-time"} control={<Radio />} label="part-time" />
                <FormControlLabel value={"contract"} control={<Radio />} label="contract" />
              </RadioGroup>
              <Stack direction="row" spacing={10}>
                <Button variant="outlined" color="success" type='submit' endIcon={<Edit/>} >Create</Button>
                <Button variant="outlined" color="warning" onClick={employeeAddModalClose} endIcon={<Cancel/>} >Cancel</Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default AddEmployeeeModel;