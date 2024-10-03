import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { Button, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Cancel, Edit } from '@mui/icons-material';
import TableChartIcon from '@mui/icons-material/TableChart';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { itemDataTable } from '../../inventory/itemComponents/ItemTable';
import axios from 'axios';
import ItemTableModal from './ItemTableModal';
import { enqueueSnackbar } from 'notistack';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 740,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  
};

export interface PromoData{
    name?: string|null;
    desc?: string|null;
    status?: boolean;
    dis_percentage?: number|null;
    dis_amount?: number|null;
    start_date?: Dayjs|null;
    end_date?: Dayjs|null;
    itemId?: number|null;
}

const AddPromotionModal = ({promoAddModalClose, open, addPromotion}:{promoAddModalClose: ()=>void, open: boolean, addPromotion: (promoData: PromoData)=>Promise<boolean>}) => {
    const [name,setName]  = useState<string|null>();
    const [desc,setDesc] = useState<string|null>();
    const [status,setStatus] = useState<boolean>(true);
    const [dis_percentage,setDis_percentage]  = useState<number|null>();
    const [dis_amount,setDis_amount] = useState<number|null>();
    const [start_date,setStart_date] = useState<Dayjs|null>(dayjs());
    const [end_date,setEnd_date] = useState<Dayjs|null>(dayjs());

    // form control states
    const [promoType,setPromoType] = useState<boolean>(true);
    const [selectedRow,setSelectedRow] = useState<itemDataTable|null>();

    // get all items
    const [itemList,setItemList]  = useState<itemDataTable[]>([]);
    const getItems = async ()=>{
        const res = await axios.get("api/inventory/item");
        setItemList(res.data);
    }

    const [tableOpen, setTableOpen] = useState(false);

    const itemTableOpen = () => {
        setTableOpen(true);
    };
    const itemTableClose = () => {
        setTableOpen(false);
    };

    useEffect(()=>{
        setName(null);
        setDesc(null);
        setStatus(true);
        setDis_percentage(null);
        setDis_amount(null);
        setStart_date(null);
        setEnd_date(null);
        setPromoType(true);
        setSelectedRow(null);
        getItems();

    },[]);

    return (
        <div>
            <Modal
                open={open}
                onClose={() => {
                    promoAddModalClose();
                    setSelectedRow(null);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        Add new Promotion
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 3, width: '85ch' },
                            }}
                            autoComplete="off"
                            onSubmit={async (e) => {
                                if(dis_percentage && dis_percentage>100){
                                    enqueueSnackbar("Discount percentage should be less than 100%...", {variant:  "error"});
                                    return;
                                }
                                if((dis_amount && selectedRow?.price) && dis_amount>selectedRow.price){
                                    enqueueSnackbar("Discount amount should be less than current item price...", {variant:  "error"});
                                    return;
                                }
                                e.preventDefault();
                                const state = addPromotion({ name, desc, status, dis_percentage, dis_amount, start_date, end_date, itemId: selectedRow?.id });
                            }}
                        >
                            <Stack direction="column" spacing={1}>
                                <Box>
                                    <Button variant="contained" color="info" onClick={itemTableOpen} endIcon={<TableChartIcon />}>Select Item</Button>
                                </Box>
                                <Box>
                                    {selectedRow &&
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell align="center">Name</TableCell>
                                                        <TableCell align="center">Category</TableCell>
                                                        <TableCell align="center">Current Price</TableCell>
                                                        <TableCell align="center">Amount</TableCell>
                                                        <TableCell align="center">Unit</TableCell>
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
                                                        <TableCell align="center">{selectedRow.name}</TableCell>
                                                        <TableCell align="center">{selectedRow.category}</TableCell>
                                                        <TableCell align="center">{selectedRow.price}</TableCell>
                                                        <TableCell align="center">{selectedRow.qty}</TableCell>
                                                        <TableCell align="center">{selectedRow.unit}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>}
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={5}>
                                <Box>
                                    <TextField id="outlined-basic1" label="Promotion Name" variant="outlined" name="name" onChange={(e) => setName(e.target.value)} />
                                </Box>
                                <Box>
                                    <TextField id="outlined-basic1" label="Description" variant="outlined" name="desc" onChange={(e) => setDesc(e.target.value)} />
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={15}>
                                <Box>
                                    <FormLabel id="demo-radio-buttons-group-label">Promotion Status</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={true}
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
                                    <TextField type="number" id="outlined-basic2" label="Percentage" value={promoType ? dis_percentage:''}  variant="outlined" name="dis_percentage" onChange={(e) => setDis_percentage(Number.parseFloat(e.target.value))} disabled={!promoType} />
                                </Box>
                                <Box>
                                    <TextField type="number" id="outlined-basic2" label="Amount" value={!promoType ? dis_amount:''}  variant="outlined" name="dis_amount" onChange={(e) => setDis_amount(Number.parseFloat(e.target.value))} disabled={promoType} />
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={5}>
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="Start Date" onChange={(val) => setStart_date(val)} minDate={dayjs()} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="End Date" onChange={(val) => setEnd_date(val)} minDate={dayjs()} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={10}>
                                <Button variant="outlined" color="success" type='submit' endIcon={<Edit />}>Create</Button>
                                <Button variant="outlined" color="warning" onClick={() => {
                                    promoAddModalClose();
                                    setSelectedRow(null);
                                }} endIcon={<Cancel />}>Cancel</Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <ItemTableModal open={tableOpen} handleClose={itemTableClose} data={itemList} setSelectedRow={setSelectedRow} />
        </div>
    );
}

export default AddPromotionModal;