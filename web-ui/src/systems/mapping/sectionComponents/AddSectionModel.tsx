import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SectionType } from './SectionTable';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack, TextField } from '@mui/material';
import { Cancel, Edit } from '@mui/icons-material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const AddSectionModel = ({open, handleClose, addSection}:{open: boolean, handleClose :()=>void, addSection: (data: SectionType)=>void })=>{
    const [name,setName] = useState<string|null>();
    const [top_y,setTop_y] = useState<number|null>();
    const [top_x,setTop_x] = useState<number|null>();
    const [bottom_y,setBottom_y] = useState<number|null>();
    const [bottom_x,setBottom_x] = useState<number|null>();

    useEffect(()=>{
        // clear states
        setName(null);
        setTop_y(null);
        setTop_x(null);
        setBottom_y(null);
        setBottom_x(null);
    },[]);
  
    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add Section
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
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 3, width: '55ch' },
                        }}
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            addSection({ name, bottom_y, bottom_x, top_y, top_x });
                        }}
                    >
                        <Box>
                            <TextField id="outlined-basic1" label="Section Name" variant="outlined" name="name" onChange={(e) => setName(e.target.value)} />
                        </Box>
                        {/* ########################    Top Cordinations   ###################### */}
                        <Stack direction="row" spacing={10}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top Y cordination" variant="outlined" onChange={(e) => setTop_y(Number.parseInt(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top X cordination" variant="outlined" onChange={(e) => setTop_x(Number.parseInt(e.target.value))} />
                            </Box>
                        </Stack>
                        {/* ########################    Bottom Cordinations   ###################### */}
                        <Stack direction="row" spacing={10}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom Y cordination" variant="outlined" onChange={(e) => setBottom_y(Number.parseInt(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom X cordination" variant="outlined" onChange={(e) => setBottom_x(Number.parseInt(e.target.value))} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={10}>
                            <Button variant="outlined" color="success" type='submit' endIcon={<Edit />} >Create</Button>
                            <Button variant="outlined" color="warning" onClick={handleClose} endIcon={<Cancel />} >Cancel</Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}

export default AddSectionModel;