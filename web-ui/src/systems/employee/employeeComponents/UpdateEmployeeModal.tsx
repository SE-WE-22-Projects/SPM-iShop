import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { EmployeeData } from "./EmployeeTabel";
import {
  Box,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { Cancel, Delete, Edit } from "@mui/icons-material";
import React from "react";
import managerImg from "../employeeAssets/managerImg.png";
import assistanceImg from "../employeeAssets/assistanceImg.png";
import cashierImg from "../employeeAssets/cashierImg.png";
import otherEmpImg from "../employeeAssets/otherEmpImg.png";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const setEmpRoleImg = (role: string) => {
  if (role === "Manager") {
    return <img src={managerImg} width={240} />;
  } else if (role === "Assistance") {
    return <img src={assistanceImg} width={240} />;
  } else if (role === "Cashier") {
    return <img src={cashierImg} width={240} />;
  } else if (role === "Other") {
    return <img src={otherEmpImg} width={240} />;
  }
};

const UpdateEmployeeModal = ({
  open,
  handleClose,
  data,
  updateEmployee,
  deleteEmployee,
}: {
  open: boolean;
  handleClose: () => void;
  data: EmployeeData;
  updateEmployee: (data: EmployeeData) => void;
  deleteEmployee: (id: number | null) => void;
}) => {
  // states for add employee
  const [id, setId] = useState<number | null>(data.id ?? null);
  const [name, setName] = useState<string | null>(data.name ?? "");
  const [role, setRole] = useState<string>("Manager");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(
    data.dateOfBirth ?? null
  );
  const [gender, setGender] = useState<string>("male");
  const [contactNumber, setContactNumber] = useState<string | null>(
    data.contactNumber ?? null
  );
  const [email, setEmail] = useState<string | null>(data.email ?? null);
  const [address, setAddress] = useState<string | null>(data.email ?? null);
  const [hireDate, setHireDate] = useState<Dayjs | null>(data.hireDate ?? null);
  const [basicSalary, setBasicSalary] = useState<number | null>(
    data.basicSalary ?? null
  );
  const [employmentStatus, setEmploymentStatus] = useState<string>("full-time");

  useEffect(() => {
    setId(data.id ?? null);
    setName(data.name ?? null);
    setRole(data.role ?? "Manager");
    setDateOfBirth(data.dateOfBirth ?? null);
    setGender(data.gender ?? "Male");
    setContactNumber(data.contactNumber ?? null);
    setEmail(data.email ?? null);
    setAddress(data.address ?? null);
    setHireDate(data.hireDate ?? null);
    setBasicSalary(data.basicSalary ?? null);
    setEmploymentStatus(data.employmentStatus ?? "full-time");
  }, [data]);

  return (
    <React.Fragment>
      <BootstrapDialog
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Employee Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box justifyContent="center" display="flex">
            {setEmpRoleImg(data.role ?? "Manager")}
          </Box>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 3, width: "85ch" },
              }}
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                updateEmployee({
                  id,
                  name,
                  role,
                  dateOfBirth,
                  gender,
                  contactNumber,
                  email,
                  address,
                  hireDate,
                  basicSalary,
                  employmentStatus,
                });
              }}
            >
              <Stack direction="row" spacing={8}>
                <Box>
                  <TextField
                    id="outlined-basic1"
                    label="Employee Name"
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Box>
                <Box>
                  <TextField
                    id="outlined-select3"
                    name="role"
                    select
                    label="Role"
                    value={role}
                    helperText="Please select role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value={"Manager"}>Manager</MenuItem>
                    <MenuItem value={"Assistance"}>Assistance</MenuItem>
                    <MenuItem value={"Cashier"}>Cashier</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                  </TextField>
                </Box>
              </Stack>
              <Stack direction="row" spacing={8}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Birth Date"
                        value={dayjs(dateOfBirth)}
                        onChange={(val) => setDateOfBirth(val)}
                        maxDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={"male"}
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel
                      value={"male"}
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value={"female"}
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </Box>
              </Stack>
              <Stack direction="row" spacing={8}>
                <Box>
                  <TextField
                    type="text"
                    id="outlined-basic2"
                    label="Contact No"
                    variant="outlined"
                    value={contactNumber}
                    name="contactNumber"
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </Box>
                <Box>
                  <TextField
                    type="email"
                    id="outlined-basic2"
                    label="Email"
                    variant="outlined"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
              </Stack>
              <Box>
                <TextField
                  type="text"
                  id="outlined-basic2"
                  label="Address"
                  variant="outlined"
                  value={address}
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Hire Date"
                      value={dayjs(hireDate)}
                      onChange={(val) => setHireDate(val)}
                      maxDate={dayjs()}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box>
                <TextField
                  type="number"
                  id="outlined-basic2"
                  label="Basic Salary"
                  variant="outlined"
                  value={basicSalary}
                  name="basicSalary"
                  onChange={(e) =>
                    setBasicSalary(Number.parseInt(e.target.value))
                  }
                />
              </Box>
              <FormLabel id="demo-radio-buttons-group-label">
                Employement Status
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={"full-time"}
                name="employmentStatus"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
              >
                <FormControlLabel
                  value={"full-time"}
                  control={<Radio />}
                  label="full-time"
                />
                <FormControlLabel
                  value={"part-time"}
                  control={<Radio />}
                  label="part-time"
                />
                <FormControlLabel
                  value={"contract"}
                  control={<Radio />}
                  label="contract"
                />
              </RadioGroup>
              <Stack direction="row" spacing={10}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteEmployee(id)}
                  size="large"
                  endIcon={<Delete />}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  size="large"
                  type="submit"
                  endIcon={<Edit />}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleClose}
                  size="large"
                  endIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default UpdateEmployeeModal;
