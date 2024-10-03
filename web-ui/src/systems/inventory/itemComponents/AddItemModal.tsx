import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { Cancel, Edit } from '@mui/icons-material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    borderRadius: 4,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,

};

export interface addItemData{
    name?: string|null;
    desc?: string|null;
    category?: string;
    price?: number|null;
    unit?: string;
    qty?: number|null;
}

const AddItemModal=({ itemAddModalClose, open, addItem}:{ itemAddModalClose: ()=>void, open: boolean, addItem: (itemData: addItemData)=> void}) => {
    // states for add Item data
    const [name,setName] = useState<string|null>();
    const [desc,setDesc] = useState<string|null>();
    const [category,setCategory] = useState<string>("Grocery");
    const [price,setPrice] = useState<number|null>();
    const [unit,setUnit] = useState<string>("pieces");
    const [qty,setQty] = useState<number|null>();

    useEffect(() => {
        setName(null);
        setDesc(null);
        setPrice(null);
        setQty(null);
    },[]);

    return (
        <div>
            <Modal
                open={open}
                onClose={itemAddModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h5" component="h2">
                        Add new Item
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 3, width: '60ch' },
                            }}
                            autoComplete="off"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addItem({name,desc,category,price,unit,qty});
                                
                                //itemAddModalClose();
                            }}
                        >
                            <Box>
                                <TextField id="outlined-basic1" label="Item Name" variant="outlined" name="name" onChange={(e) => setName(e.target.value)} />
                            </Box>
                            <Stack direction="row" spacing={7}>
                                <Box>
                                    <TextField id="outlined-basic1" label="Item Description" variant="outlined" name="desc" onChange={(e) => setDesc(e.target.value)} />
                                </Box>
                                <Box>
                                    <TextField
                                        id="outlined-select3"
                                        name="category"
                                        select
                                        label="Category"
                                        defaultValue={category}
                                        value={category}
                                        helperText="Please select rack ID"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <MenuItem value={"Grocery"}>
                                            Grocery
                                        </MenuItem>
                                        <MenuItem value={"Fruits"}>
                                            Fruits
                                        </MenuItem>
                                        <MenuItem value={"Vegetables"}>
                                            Vegetables
                                        </MenuItem>
                                        <MenuItem value={"Meat and Seafood"}>
                                            Meat and Seafood
                                        </MenuItem>
                                        <MenuItem value={"Cleaning Supplies"}>
                                            Cleaning Supplies
                                        </MenuItem>
                                        <MenuItem value={"Electronics"}>
                                            Electronics
                                        </MenuItem>
                                        <MenuItem value={"Cosmatic"}>
                                            Cosmatic
                                        </MenuItem>
                                    </TextField>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={7}>
                                <TextField type="number" id="outlined-basic2" label="Quantity" variant="outlined" name="qty" onChange={(e) => setQty(Number.parseInt(e.target.value))} />
                                <TextField
                                    id="outlined-select3"
                                    name="unit"
                                    select
                                    label="Measurement Unit"
                                    defaultValue={unit}
                                    value={unit}
                                    helperText="Please select measurement unit"
                                    onChange={(e) => setUnit(e.target.value)}
                                >
                                    <MenuItem value={"pieces"}>
                                        Pieces
                                    </MenuItem>
                                    <MenuItem value={"grams"}>
                                        Grams
                                    </MenuItem>
                                    <MenuItem value={"liters"}>
                                        Liters
                                    </MenuItem>
                                </TextField>
                            </Stack>
                            <Box>
                                <TextField type="number" id="outlined-basic2" label="Unit Price" variant="outlined" name="price" onChange={(e) => setPrice(Number.parseFloat(e.target.value))} />
                            </Box>
                            <Stack direction="row" spacing={10}>
                                <Button variant="outlined" color="success" type='submit' endIcon={<Edit/>} >Create</Button>
                                <Button variant="outlined" color="warning" onClick={itemAddModalClose} endIcon={<Cancel/>} >Cancel</Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default AddItemModal;