import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { PromotionType } from './PromotionTable';
import { Box, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Cancel, Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const UpdatePromotionModal = ({open, handleClose, data, updatePromotion, deletePromotion}:{open: boolean, handleClose :()=>void, data:PromotionType, updatePromotion: (data:PromotionType)=>Promise<boolean>, deletePromotion: (id:number|null)=>void })=>{
    const [id,setId] = useState<number|null>(data.id ?? null);
    const [name,setName]  = useState<string|null>();
    const [desc,setDesc] = useState<string|null>();
    const [status,setStatus] = useState<boolean>(true);
    const [dis_percentage,setDis_percentage]  = useState<number|null>();
    const [dis_amount,setDis_amount] = useState<number|null>();
    const [start_date,setStart_date] = useState<Dayjs|null>(dayjs());
    const [end_date,setEnd_date] = useState<Dayjs|null>(dayjs());
    const [itemId,setItemId] = useState<number|null>();

    // form control states
    const [promoType,setPromoType] = useState<boolean>(true);

    useEffect(()=>{
        setId(data.id ?? null);
        setName(data.name ?? null);
        setDesc(data.desc ?? null);
        setStatus(data.status ?? true);
        setDis_percentage(data.dis_percentage ?? null);
        setDis_amount(data.dis_amount ?? null);
        setStart_date(data.start_date ?? null);
        setEnd_date(data.end_date ?? null);
        setPromoType(data.dis_percentage ? true : false);
    },[data]);
  
    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Update Promotion Details
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
                            '& > :not(style)': { m: 3, width: '65ch' },
                        }}
                        autoComplete="off"
                        onSubmit={async (e) => {
                            if (dis_percentage && dis_percentage > 100) {
                                enqueueSnackbar("Discount percentage should be less than 100%...", { variant: "error" });
                                return;
                            }
                            // TODO: implement logic for get item current price 
                            // if ((dis_amount && selectedRow?.price) && dis_amount > selectedRow.price) {
                            //     enqueueSnackbar("Discount amount should be less than current item price...", { variant: "error" });
                            //     return;
                            // }
                            e.preventDefault();
                            const state = updatePromotion({id, name, desc, status, dis_percentage, dis_amount, start_date, end_date, itemId });
                            if (await state) {
                                setName(null);
                                setDesc(null);
                                setStatus(true);
                                setDis_percentage(null);
                                setDis_amount(null);
                                setStart_date(null);
                                setEnd_date(null);
                                setPromoType(true);
                                setItemId(null);
                            }

                        }}
                    >
                        <Stack direction="row" spacing={5}>
                            <Box>
                                <TextField id="outlined-basic1" label="Promotion Name" value={name} variant="outlined" name="name" onChange={(e) => setName(e.target.value)} />
                            </Box>
                            <Box>
                                <TextField id="outlined-basic1" label="Description" value={desc} variant="outlined" name="desc" onChange={(e) => setDesc(e.target.value)} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={15}>
                            <Box>
                                <FormLabel id="demo-radio-buttons-group-label">Promotion Status</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={status}
                                    name="radio-buttons-group"
                                    onChange={(e) => setStatus(e.target.value === "true")}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio />} label="Inactive" />
                                </RadioGroup>
                            </Box>
                            <Box>
                                <FormLabel id="demo-radio-buttons-group-label">Promotion Type</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={promoType}
                                    value={promoType}
                                    name="radio-buttons-group"
                                    onChange={(e) => {
                                        promoType ? setDis_percentage(null) : setDis_amount(null);
                                        setPromoType(e.target.value === "true");
                                    }}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Percentage" />
                                    <FormControlLabel value={false} control={<Radio />} label="Amount" />
                                </RadioGroup>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={5}>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Percentage" value={promoType ? dis_percentage : ''} variant="outlined" name="dis_percentage" onChange={(e) => setDis_percentage(Number.parseFloat(e.target.value))} disabled={!promoType} />
                            </Box>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Amount" value={!promoType ? dis_amount : ''} variant="outlined" name="dis_amount" onChange={(e) => setDis_amount(Number.parseFloat(e.target.value))} disabled={promoType} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={5}>
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Start Date" value={dayjs(start_date)} onChange={(val) => setStart_date(val)} minDate={dayjs()} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="End Date" value={dayjs(end_date)} onChange={(val) => setEnd_date(val)} minDate={dayjs()} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={10}>
                            <Button variant="outlined" color="error" onClick={()=>deletePromotion(id)} size="large" endIcon={<Delete/>} >Delete</Button>
                            <Button variant="outlined" color="success" size="large" type='submit' endIcon={<Edit/>} >Update</Button>
                            <Button variant="outlined" color="warning" onClick={handleClose} size="large" endIcon={<Cancel/>} >Cancel</Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment >
    );
}

export default UpdatePromotionModal;