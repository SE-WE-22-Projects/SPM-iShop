import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

import { Button, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  height: '900px',
  p: 4,
  overflow: 'auto'
};

export interface EmpAddData{
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
const AddEmployeeeModel = ({employeeAddModalClose,open,addEmployee}:{employeeAddModalClose:()=>void, open: boolean, addEmployee: (empData: EmpAddData)=>void})=>{
  const[empData,setEmpData] = useState<EmpAddData>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmpData((prevItemData) => ({
        ...prevItemData,
        [name]: value,
    }));
  }
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
                Add new Item
            </Typography>
            <Box id="modal-modal-description" sx={{ mt: 2 }}>
              <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 3, width: '25ch' },
                }}
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault();
                    addEmployee(empData);
                    //itemAddModalClose();
                }}
              >
                <Box>
                    <TextField id="outlined-basic1" label="Employee Name" variant="outlined" name="name" onChange={handleChange} />
                </Box>
                <Box>
                  <TextField
                      id="outlined-select3"
                      name="role"
                      select
                      label="Role"
                      defaultValue="Manager"
                      helperText="Please select role"
                      onChange={handleChange}
                  >
                    <MenuItem value={"Manager"}>
                      Manager
                    </MenuItem>
                    <MenuItem value={"Assistance"}>
                      Assistance
                    </MenuItem>
                    <MenuItem value={"Chashier"}>
                      Chashier
                    </MenuItem>
                    <MenuItem value={"Other"}>
                      Other
                    </MenuItem>
                  </TextField>
                </Box>
                <Box>
                    <label htmlFor="dateOfBirth">Birth Date:</label>
                    <input type="date" name='dateOfBirth' onChange={handleChange}/>
                </Box>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={"male"}
                    name="gender"
                    onChange={handleChange}
                >
                  <FormControlLabel value={"male"} control={<Radio />} label="Male" />
                  <FormControlLabel value={"female"} control={<Radio />} label="Female" />
                </RadioGroup>
                <Box>
                    <TextField type="number" id="outlined-basic2" label="Contact No" variant="outlined" name="contactNumber" onChange={handleChange} />
                </Box>
                <Box>
                    <TextField type="email" id="outlined-basic2" label="Email" variant="outlined" name="email" onChange={handleChange} />
                </Box>
                <Box>
                    <TextField type="text" id="outlined-basic2" label="Address" variant="outlined" name="address" onChange={handleChange} />
                </Box>
                <Box>
                    <label htmlFor="Hired date">Hired Date:</label>
                    <input type="date" name='hireDate' onChange={handleChange}/>
                </Box>
                <Box>
                    <TextField type="number" id="outlined-basic2" label="Basic Salary" variant="outlined" name="basicSalary" onChange={handleChange} />
                </Box>
                <FormLabel id="demo-radio-buttons-group-label">Employement Status</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={"full-time"}
                    name="employmentStatus"
                    onChange={handleChange}
                >
                  <FormControlLabel value={"full-time"} control={<Radio />} label="full-time" />
                  <FormControlLabel value={"part-time"} control={<Radio />} label="part-time" />
                  <FormControlLabel value={"contract"} control={<Radio />} label="contract" />
                </RadioGroup>
                  <Stack direction="row" spacing={2}>
                      <Button variant="outlined" color="success" type='submit'>Create</Button>
                      <Button variant="outlined" color="error" onClick={employeeAddModalClose} >Cancel</Button>
                  </Stack>
              </Box>
            </Box>
          </Box>
        </Modal>
    </div>
  )
}

export default AddEmployeeeModel;