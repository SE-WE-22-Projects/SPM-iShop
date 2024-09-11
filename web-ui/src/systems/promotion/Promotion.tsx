import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchBar from "../../common/SearchBar";
import { Add } from "@mui/icons-material";
import PromotionTable, { PromotionType } from "./promotionComponents/PromotionTable";
import axios from "axios";
import AddPromotionModal, { PromoData } from "./promotionComponents/AddPromotionModal";
import { enqueueSnackbar } from "notistack";

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

    // get all promotions
    const [promoList,setPromoList]  = useState<PromotionType[]>([]);
    const getPromotions = async ()=>{
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
            return;
        }
        else if(!promoData.desc){
            enqueueSnackbar("Promotion description is required...", {variant: "error"});
            return;
        }
        else if(!promoData.dis_percentage){
            enqueueSnackbar("Promotion percentage required...", {variant: "error"});
            return;
        }
        else if(!promoData.dis_amount){
            enqueueSnackbar("Promotion amount required...", {variant: "error"});
            return;
        }
        else if(!promoData.start_date){
            enqueueSnackbar("Please  select start date", {variant: "error"});
            return;
        }
        else if(!promoData.end_date){
            enqueueSnackbar("Please select end date", {variant: "error"});
            return;
        }
        else if(!promoData.itemId){
            enqueueSnackbar("Please select item id...", {variant: "error"});
            return;
        }
        // api call
        try{
            await axios.post("api/promotions/promotion",promoData);
            enqueueSnackbar("Promotion added successfuly...", {variant:  "success"});
            promoAddModalClose();
            getPromotions();
        }
        catch(e){
            enqueueSnackbar("failed to add item...", {variant: "error"});
            console.error(e);
        }
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
            <PromotionTable data={promoList} query={searchQuery}/>
            <AddPromotionModal promoAddModalClose={promoAddModalClose} open={addOpen} addPromotion={addPromotion} />
       </div>
    );
}

export default Promotion;