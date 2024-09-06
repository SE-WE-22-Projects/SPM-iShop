import { Box, Button, Typography } from "@mui/material";
import SearchBar from "../../common/SearchBar";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import ItemTable from "./itemComponents/ItemTable";
import AddItemModal, { itemData } from "./itemComponents/AddItemModal";
import { enqueueSnackbar } from 'notistack';
import axios from "axios";

const Item = () => { 
    // real time search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const search = (str: string)=>{
        setSearchQuery(str);
    }
    // handle add item modal
    const [addOpen, setAddOpen] = useState(false);
    const itemAddModalOpen = () => setAddOpen(true);
    const itemAddModalClose = () => setAddOpen(false);

    // get all items
    const [itemList,setItemList]  = useState<itemData[]>([]);
    const getItems = async ()=>{
        const res = await axios.get("api/inventory/item");
        setItemList(res.data);
    }

    useEffect(()=>{
        getItems();
    },[]);

    // add item
    const addItem = async (itemData: itemData) => {
        // data validation
        if(!itemData.name){
            enqueueSnackbar("Item name is required...", {variant:  "error"});
            return;
        }
        else if(!itemData.desc){
            enqueueSnackbar("Item description is required...", {variant: "error"});
            return;
        }
        else if(!itemData.price){
            enqueueSnackbar("Item unit price required...", {variant: "error"});
            return;
        }
        else if(!itemData.qty){
            enqueueSnackbar("Item quantity required...", {variant: "error"});
            return;
        }
        else if(!itemData.rackId){
            enqueueSnackbar("Please select rack id...", {variant: "error"});
            return;
        }
        // api call
        try{
            await axios.post("api/inventory/item",itemData);
            enqueueSnackbar("Item added successfuly...", {variant:  "success"});
            itemAddModalClose();
            getItems();
        }
        catch(e){
            enqueueSnackbar("failed to add item...", {variant: "error"});
            console.error(e);
        }
    }

    return (
        <>
            <div>
                <Typography variant="h3" align="center"> Item Management</Typography>
                <Box sx={{ display: "flex" }} my={2} mx={15} >
                    <SearchBar onSearch={search} />
                    <Box flexGrow={1}></Box> 
                    <Button variant="outlined" startIcon={<Add />} onClick={itemAddModalOpen} >
                        Add Item
                    </Button>
                </Box>
                <ItemTable data={itemList} query={searchQuery}/>
                <AddItemModal itemAddModalClose={itemAddModalClose} open={addOpen} addItem={addItem} />
            </div>
            
        </>
    );
}

export default Item;