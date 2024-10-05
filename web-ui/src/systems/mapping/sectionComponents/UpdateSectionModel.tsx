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
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Cancel, Delete, Edit } from '@mui/icons-material';
import sectionImg from '../mappingAssets/sectionImg.png'
import { Typography } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const UpdateSectionModel = ({ open, handleClose, data, updateSection, deleteSection }: { open: boolean, handleClose: () => void, data: SectionType, updateSection: (data: SectionType) => void, deleteSection: (id: number)=>void }) => {
    const [id, setId] = useState<number|null>(data.id ?? null);
    const [name, setName] = useState<string|null>(data.name ?? null);
    const [top_y, setTop_y] = useState<number|null>(data.top_y ?? null);
    const [top_x, setTop_x] = useState<number|null>(data.top_x ?? null);
    const [bottom_y, setBottom_y] = useState<number|null>(data.bottom_y ?? null);
    const [bottom_x, setBottom_x] = useState<number|null>(data.bottom_x ?? null);

    useEffect(() => {
        setId(data.id ?? null);
        setName(data.name ?? null);
        setTop_y(data.top_y ?? null);
        setTop_x(data.top_x ?? null);
        setBottom_y(data.bottom_y ?? null);
        setBottom_x(data.bottom_x ?? null);
    }, [data]);

    return (
        <React.Fragment>
            <BootstrapDialog
                maxWidth='md'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Section Details
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
                        <img src={sectionImg} width={240} />
                    </Box>
                    <Typography margin={5} align='center' fontWeight='fontWeightBold'>Section ID : {id}</Typography>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 3, width: '85ch' },
                        }}
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateSection({id,name,top_y,top_x,bottom_y,bottom_x})
                            // clear states
                            setId(null);
                            setName(null);
                            setTop_y(null);
                            setTop_x(null);
                            setBottom_y(null);
                            setBottom_x(null);
                        }}
                    >
                        <Box>
                            <TextField id="outlined-basic1" label="Section Name" variant="outlined" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                        </Box>
                        {/* ########################    Top Cordinations   ###################### */}
                        <Stack direction="row" spacing={7}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top Y cordination" variant="outlined" value={top_y} onChange={(e) => setTop_y(Number.parseInt(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Top X cordination" variant="outlined" value={top_x} onChange={(e) => setTop_x(Number.parseInt(e.target.value))} />
                            </Box>
                        </Stack>
                        {/* ########################    Bottom Cordinations   ###################### */}
                        <Stack direction="row" spacing={7}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom Y cordination" variant="outlined" value={bottom_y} onChange={(e) => setBottom_y(Number.parseInt(e.target.value))} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Bottom X cordination" variant="outlined" value={bottom_x} onChange={(e) => setBottom_x(Number.parseInt(e.target.value))} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={10}>
                                <Button variant="outlined" color="error" onClick={() =>{id && deleteSection(id)} } size="large" endIcon={<Delete />} >Delete</Button>
                                <Button variant="outlined" color="success" size="large" type='submit' endIcon={<Edit />} >Update</Button>
                                <Button variant="outlined" color="warning" onClick={handleClose} size="large" endIcon={<Cancel />} >Cancel</Button>
                            </Stack>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}

export default UpdateSectionModel;