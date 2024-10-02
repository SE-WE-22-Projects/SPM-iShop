import { Box, Button, Typography } from "@mui/material";
import SearchBar from "../../common/SearchBar";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import ItemTable, { itemDataTable } from "./itemComponents/ItemTable";
import AddItemModal, { addItemData } from "./itemComponents/AddItemModal";
import { enqueueSnackbar } from 'notistack';
import axios from "axios";
import { updateItemType } from "./itemComponents/UpdateItemModal";
import { useConfirm } from 'material-ui-confirm';
import PageLoader from "../../common/PageLoader";

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

    // handle update item modal
    const [updateOpen, setUpdateOpen] = useState(false);
    const itemUpdateModalOpen = () => {
      setUpdateOpen(true);
    };
    const itemUpdateModalClose = () => {
      setUpdateOpen(false);
    };

    // get all items
    const [itemList,setItemList]  = useState<itemDataTable[]>([]);
    const getItems = async ()=>{
        const res = await axios.get("api/inventory/item");
        setItemList(res.data);
    }

    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        getItems(); 
        setTimeout(()=>setIsLoading(false),1000);
    },[]);

    // add item
    const addItem = async (itemData: addItemData) => {
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
        else if(itemData.price < 0){
            enqueueSnackbar("Item unit price should be positive...", {variant: "error"});
            return;
        }
        else if(!itemData.qty){
            enqueueSnackbar("Item quantity required...", {variant: "error"});
            return;
        }
        else if(itemData.qty < 0){
            enqueueSnackbar("Item quantity should be positive...", {variant: "error"});
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

    // confirm box handle
    const confirm = useConfirm();

    //update item
    const updateItem = async(data: updateItemType)=>{
        // data validation
        if(!data.name){
            enqueueSnackbar("Item name is required...", {variant:  "error"});
            return;
        }
        else if(!data.desc){
            enqueueSnackbar("Item description is required...", {variant: "error"});
            return;
        }
        else if(!data.price){
            enqueueSnackbar("Item unit price required...", {variant: "error"});
            return;
        }
        else if(data.price < 0){
            enqueueSnackbar("Item unit price should be positive...", {variant: "error"});
            return;
        }
        else if(!data.qty){
            enqueueSnackbar("Item quantity required...", {variant: "error"});
            return;
        }
        else if(data.qty < 0){
            enqueueSnackbar("Item quantity should be positive...", {variant: "error"});
            return;
        }
        confirm( {description: "Confirm Update Item Details"})
        .then(
            async ()=>{
                try{
                    await axios.put(`api/inventory/item/${data.id}`,data);
                    enqueueSnackbar("Item updated successfuly...", {variant:  "success"});
                    itemUpdateModalClose();
                    getItems();
                }
                catch(e){
                    enqueueSnackbar("failed to update item...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            itemUpdateModalClose();
        });
    }

    // delete item
    const deleteItem = async(id:number|null)=>{
        confirm( {description: "Confirm Delete Item Details"})
        .then(
            async ()=>{
                try{
                    await axios.delete(`api/inventory/item/${id}`);
                    enqueueSnackbar("Item deleted successfuly...", {variant:  "success"});
                    itemUpdateModalClose();
                    getItems();
                }
                catch(e){
                    enqueueSnackbar("failed to delete Item...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            itemUpdateModalClose();
        })
    }

    return (
        <div>
            {isLoading ? <PageLoader /> :
                <div>
                    <Typography variant="h3" align="center"> Item Management</Typography>
                    <Box sx={{ display: "flex" }} my={2} mx={15} >
                        <SearchBar onSearch={search} />
                        <Box flexGrow={1}></Box>
                        <Button variant="outlined" startIcon={<Add />} onClick={itemAddModalOpen} >
                            Add Item
                        </Button>
                    </Box>
                    <ItemTable data={itemList} query={searchQuery} updateOpen={updateOpen} itemUpdateModalOpen={itemUpdateModalOpen} itemUpdateModalClose={itemUpdateModalClose} updateItem={updateItem} deleteItem={deleteItem} />
                    <AddItemModal itemAddModalClose={itemAddModalClose} open={addOpen} addItem={addItem} />
                </div>
            }
        </div>     
    );
}

export default Item;