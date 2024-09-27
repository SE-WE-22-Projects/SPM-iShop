import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';
import {Delete, Edit, Cancel} from '@mui/icons-material';
import cleaningImg from '../inventoryAssets/Cleaning Supplies.png';
import cosmaticImg from '../inventoryAssets/Cosmatic.png';
import electronicImg from '../inventoryAssets/Electronics.jpeg';
import fruitsImg from '../inventoryAssets/Fruits.png';
import groceryImg from '../inventoryAssets/Grocery.png';
import meatImg from '../inventoryAssets/Meat and Seafood.png';
import vegiImg from '../inventoryAssets/Vegitables.png';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  export interface updateItemType{
    id?:number|null;
    name?: string|null;
    desc?: string|null;
    category?: string|null;
    price?: number|null;
    unit?: string|null;
    qty?: number|null;
  }

  const setItemImage = (category: string)=>{
    if(category === "Grocery"){
        return (
            <img src={groceryImg} width={180} />
        )
    }
    else if(category === "Fruits"){
        return (
            <img src={fruitsImg} width={180} />
        )
    }
    else if(category === "Vegetables"){
        return (
            <img src={vegiImg} width={180} />
        )
    }
    else if(category === "Meat and Seafood"){
        return (
            <img src={meatImg} width={180} />
        )
    }
    else if(category === "Cleaning Supplies"){
        return (
            <img src={cleaningImg} width={180} />
        )
    }
    else if(category === "Electronics"){
        return (
            <img src={electronicImg} width={180} />
        )
    }
    else if(category === "Cosmatic"){
        return (
            <img src={cosmaticImg} width={180} />
        )
    }    
  }

const UpdateItemModal = ({open, handleClose, data, updateItem, deleteItem}:{open: boolean, handleClose :()=>void, data:updateItemType, updateItem: (data:updateItemType)=>void, deleteItem: (id:number|null)=>void })=>{
    // states for update Item data
    const [id,setId] = useState<number|null>(data.id ?? null);
    const [name,setName] = useState<string|null>(data.name ?? "");
    const [desc,setDesc] = useState<string|null>(data.desc ?? "");
    const [category,setCategory] = useState<string>(data.category ?? "Grocery");
    const [price,setPrice] = useState<number|null>(data.price ?? 0);
    const [unit,setUnit] = useState<string>(data.unit ?? "pieces");
    const [qty,setQty] = useState<number|null>(data.qty ?? 0);

    useEffect(()=>{
        setId(data.id ?? null);
        setName(data.name ?? null);
        setDesc(data.desc ?? null);
        setCategory(data.category ?? "Grocery");
        setPrice(data.price ?? 0);
        setUnit(data.unit ?? "pieces");
        setQty(data.qty ?? 0);
    },[data]);

    return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Item Details
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
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
                <Box>
                    {setItemImage(category)}
                </Box>
                <Box fontWeight="fontWeightBold" >
                    <Typography fontSize={20}><strong>Item ID:</strong> {data.id}</Typography>
                    <Typography fontSize={20}><strong>Item Name:</strong> {data.name}</Typography>
                    <Typography fontSize={20}><strong>Item Category:</strong> {data.category}</Typography>
                </Box>
            </Stack>
            <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 3, width: '60ch' },
                    }}
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateItem({id, name, desc, category, price, unit, qty});
                        setName(null);
                        setDesc(null);
                        setPrice(null);
                        setQty(null);
                        //itemAddModalClose();
                    }}
                >
                    <Box>
                        <TextField id="outlined-basic1" label="Item Name" variant="outlined" value={name} name="name" onChange={(e) => setName(e.target.value)} />
                    </Box>
                    <Stack direction="row" spacing={7}>
                        <Box>
                            <TextField id="outlined-basic1" label="Item Description" variant="outlined" value={desc} name="desc" onChange={(e) => setDesc(e.target.value)} />
                        </Box>
                        <Box>
                            <TextField
                                id="outlined-select3"
                                name="category"
                                select
                                label="Category"
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
                        <TextField type="number" id="outlined-basic2" label="Quantity" variant="outlined" value={qty} name="qty" onChange={(e) => setQty(Number.parseInt(e.target.value))} />
                        <TextField
                            id="outlined-select3"
                            name="unit"
                            select
                            label="Measurement Unit"
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
                        <TextField type="number" id="outlined-basic2" label="Unit Price" variant="outlined" value={price} name="price" onChange={(e) => setPrice(Number.parseFloat(e.target.value))} />
                    </Box>
                    <Stack direction="row" spacing={10}>
                        <Button variant="outlined" color="error" onClick={()=>deleteItem(id)} size="large" endIcon={<Delete/>} >Delete</Button>
                        <Button variant="outlined" color="success" size="large" type='submit' endIcon={<Edit/>} >Update</Button>
                        <Button variant="outlined" color="warning" onClick={handleClose} size="large" endIcon={<Cancel/>} >Cancel</Button>
                    </Stack>
                </Box>
            </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default UpdateItemModal;