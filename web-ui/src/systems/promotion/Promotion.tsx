import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchBar from "../../common/SearchBar";
import { Add } from "@mui/icons-material";
import PromotionTable, { PromotionType } from "./promotionComponents/PromotionTable";
import axios from "axios";
import AddPromotionModal, { PromoData } from "./promotionComponents/AddPromotionModal";
import { enqueueSnackbar } from "notistack";
import { useConfirm } from 'material-ui-confirm';

const Promotion = () => {
    // real time search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const search = (str: string)=>{
        setSearchQuery(str);
    }

    // handle add promotion modal
    const [addOpen, setAddOpen] = useState(false);
    const promoAddModalOpen = () => setAddOpen(true);
    const promoAddModalClose = () => setAddOpen(false);

    // handle update item modal
    const [updateOpen,setUpdateOpen] = useState(false);
    const promoUpdateModalOpen = () => setUpdateOpen(true);
    const promoUpdateModalClose = () => setUpdateOpen(false);

    // get all promotions
    const [promoList,setPromoList]  = useState<PromotionType[]>([]);
    const getPromotions = async ()=>{
        console.log("get promo data");
        
        const res = await axios.get("api/promotions/promotion");
        setPromoList(res.data);
    }

    useEffect(()=>{
        getPromotions();
    },[]);

    // add promotion
    const addPromotion = async (promoData: PromoData) =>{
        // data validation
        if(!promoData.name){
            enqueueSnackbar("Promotion name is required...", {variant:  "error"});
            return false;
        }
        else if(!promoData.desc){
            enqueueSnackbar("Promotion description is required...", {variant: "error"});
            return false;
        }
        else if(!promoData.dis_percentage && !promoData.dis_amount){
            enqueueSnackbar("Promotion percentage or amount required...", {variant: "error"});
            return false;
        }
        else if(!promoData.start_date){
            enqueueSnackbar("Please  select start date", {variant: "error"});
            return false;
        }
        else if(!promoData.end_date){
            enqueueSnackbar("Please select end date", {variant: "error"});
            return false;
        }
        else if(!promoData.itemId){
            enqueueSnackbar("Please select item ...", {variant: "error"});
            return false;
        }
        // api call
        try{
            await axios.post("api/promotions/promotion",promoData);
            enqueueSnackbar("Promotion added successfuly...", {variant:  "success"});
            promoAddModalClose();
            getPromotions();
            return true;
        }
        catch(e){
            enqueueSnackbar("failed to add promotion...", {variant: "error"});
            console.error(e);
            promoAddModalClose();
            return true;
        }
    }

    // confirm box handle
    const confirm = useConfirm();

    // update promotion
    const updatePromotion = async (data: PromotionType)=>{
        // data validation
        if(!data.name){
            enqueueSnackbar("Promotion name is required...", {variant:  "error"});
            return false;
        }
        else if(!data.desc){
            enqueueSnackbar("Promotion description is required...", {variant: "error"});
            return false;
        }
        else if(!data.dis_percentage && !data.dis_amount){
            enqueueSnackbar("Promotion percentage or amount required...", {variant: "error"});
            return false;
        }
        else if(!data.start_date){
            enqueueSnackbar("Please  select start date", {variant: "error"});
            return false;
        }
        else if(!data.end_date){
            enqueueSnackbar("Please select end date", {variant: "error"});
            return false;
        }
        
        try {
            await confirm({ description: "Confirm Update Promotion Details" });
        } catch (e) {
            promoUpdateModalClose(); 
            return false;             
        }

        try {
            await axios.put(`api/promotions/promotion/${data.id}`, data);
            enqueueSnackbar("Promotion updated successfully...", { variant: "success" });
            promoUpdateModalClose();
            getPromotions();  
            return true;     
        } catch (e) {
            enqueueSnackbar("Failed to update promotion...", { variant: "error" });
            console.error(e);
            return false;     
        }
    }

    const deletePromotion = (id: number|null)=>{
        confirm( {description: "Confirm Delete Promotion Details"})
        .then(
            async ()=>{
                try{
                    await axios.delete(`api/promotions/promotion/${id}`);
                    enqueueSnackbar("Promotion deleted successfuly...", {variant:  "success"});
                    promoUpdateModalClose();
                    getPromotions();
                }
                catch(e){
                    enqueueSnackbar("failed to delete promotion...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            promoUpdateModalClose();
        })
    }

    return (
       <div>
            <Typography variant="h3" align="center"> Promotion Management</Typography>
            <Box sx={{ display: "flex" }} my={2} mx={15} >
                <SearchBar onSearch={search} />
                <Box flexGrow={1}></Box>
                <Button variant="outlined" startIcon={<Add />} onClick={promoAddModalOpen} >
                    Add Promotion
                </Button>
            </Box>
            <PromotionTable data={promoList} updateOpen={updateOpen} updatePromotion={updatePromotion} deletePromotion={deletePromotion} query={searchQuery} promoUpdateModalOpen={promoUpdateModalOpen} promoUpdateModalClose={promoUpdateModalClose}/>
            <AddPromotionModal promoAddModalClose={promoAddModalClose} open={addOpen} addPromotion={addPromotion} />
       </div>
    );
}

export default Promotion;