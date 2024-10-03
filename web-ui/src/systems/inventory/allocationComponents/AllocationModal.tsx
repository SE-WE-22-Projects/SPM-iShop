import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { itemDataTable } from '../itemComponents/ItemTable';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useEffect, useState } from 'react';
import RackModal from './RackModal';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Paper, TableBody } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { MoveUp } from '@mui/icons-material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));



const AllocationModal = ({open, handleClose, data, allocation, rackList, rackId}:{open: boolean, handleClose :()=>void, data:itemDataTable, allocation: (itemID: number,rackId: number)=>void, rackList: any, rackId ?: number})=>{
  // handle rack table modal
  const [tableOpen, setTableOpen] = useState(false);
  const rackTableOpen = () => {
      setTableOpen(true);
  };
  const rackTableClose = () => {
      setTableOpen(false);
  };

  // handle selected row in rack table
  const [selectedRow,setSelectedRow] = useState<any>();

  const getAllocatedRack = (rackId: number)=>{
    rackList.forEach((rack:any)=>{
      if(rack.id === rackId){
        setSelectedRow(rack);
      } 
    })
  }

  useEffect(()=>{
    rackId && getAllocatedRack(rackId);
  },[open]);
  

  return (
    <React.Fragment>
      <BootstrapDialog
        maxWidth='sm'
        fullWidth
        onClose={() => {
          handleClose();
          setSelectedRow(null);
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Item Allocation
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            handleClose();
            setSelectedRow(null);
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box>
            <Button variant="contained" color="info" onClick={rackTableOpen} endIcon={<TableChartIcon />}>Select Rack</Button>
          </Box>
          <Box>
            {selectedRow &&
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rack ID</TableCell>
                      <TableCell align="center">Section ID</TableCell>
                      <TableCell align="center">Section name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      tabIndex={-1}
                      key={1}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {selectedRow.id}
                      </TableCell>
                      <TableCell align="center">{selectedRow.sectionId}</TableCell>
                      <TableCell align="center">{selectedRow.section.name}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            }
          </Box>
          <Box>
            <Box mt={5} fontWeight="fontWeightBold" >
              <Typography fontSize={20}><strong>Item ID:</strong> {data.id}</Typography>
              <Typography fontSize={20}><strong>Item Name:</strong> {data.name}</Typography>
              <Typography fontSize={20}><strong>Item Category:</strong> {data.category}</Typography>
            </Box>
          </Box>
          <Box mt={5} display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" color="success"
              onClick={() => {
                if (data.id && selectedRow) {
                  allocation(data.id, selectedRow.id);
                  setSelectedRow(null);
                  handleClose();
                }
                else {
                  enqueueSnackbar("Please select rack for alocate item...", { variant: "warning" });
                }
              }} endIcon={<MoveUp />}>Allocate</Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
      <RackModal data={rackList} open={tableOpen} setSelectedRow={setSelectedRow} handleClose={rackTableClose} />
    </React.Fragment>
  );
}

export default AllocationModal