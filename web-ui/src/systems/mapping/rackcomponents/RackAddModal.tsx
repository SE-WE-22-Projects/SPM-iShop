import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Cancel, Delete, Edit, TableChart } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import SectionTableModal from './SectionTableModal';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const RackAddModel = ({ open, handleClose, sectionData, addRack }: { open: boolean, handleClose: () => void, sectionData: any, addRack: (data: any) => void }) => {
    const [tableOpen, setTableOpen] = useState(false);
    const sectionTableOpen = () => {
        setTableOpen(true);
    };
    const sectionTableClose = () => {
        setTableOpen(false);
    };

    const [top_y, setTop_y] = useState<number | null>(null);
    const [top_x, setTop_x] = useState<number | null>(null);
    const [bottom_y, setBottom_y] = useState<number | null>(null);
    const [bottom_x, setBottom_x] = useState<number | null>(null);

    // handle selected row in section table
    const [selectedRow, setSelectedRow] = useState<any>();

    const getAllocatedSection = (sectionId: number) => {
        sectionData.forEach((section: any) => {
            if (section.id === sectionId) {
                setSelectedRow(section);
            }
        })
    }

    useEffect(() => {
        setTop_y(null);
        setTop_x(null);
        setBottom_y(null);
        setBottom_x(null);
    }, []);

    return (
        <React.Fragment>
            <BootstrapDialog
                maxWidth='md'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add Rack Details
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                    <Box justifyContent="center" display="flex">
                        {/* <img src={sectionImg} width={240} /> */}
                    </Box>
                    <Box>
                        <Box>
                            <Button variant="contained" color="info" onClick={sectionTableOpen} endIcon={<TableChart />}>Select Section</Button>
                        </Box>
                        {selectedRow &&
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
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
                                            <TableCell align="center">{selectedRow.id}</TableCell>
                                            <TableCell align="center">{selectedRow.name}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Box>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 3, width: '85ch' },
                        }}
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            addRack({ top_y, top_x, bottom_y, bottom_x, sectionId: selectedRow?.id })
                        }}
                    >
                        {/* ########################    Top Cordinations   ###################### */}
                        <Stack direction="row" spacing={7}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top Y cordinate" variant="outlined" onChange={(e) => setTop_y(Number(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top X cordinate" variant="outlined" onChange={(e) => setTop_x(Number(e.target.value))} />
                            </Box>
                        </Stack>
                        {/* ########################    Bottom Cordinations   ###################### */}
                        <Stack direction="row" spacing={7}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom Y cordinate" variant="outlined" onChange={(e) => setBottom_y(Number(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom X cordinate" variant="outlined" onChange={(e) => setBottom_x(Number(e.target.value))} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={10}>
                            <Button variant="outlined" color="success" type='submit' endIcon={<Edit />} >Create</Button>
                            <Button variant="outlined" color="warning" onClick={handleClose} endIcon={<Cancel />} >Cancel</Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
            <SectionTableModal open={tableOpen} data={sectionData} handleClose={sectionTableClose} setSelectedRow={setSelectedRow} />
        </React.Fragment>
    );
}

export default RackAddModel;