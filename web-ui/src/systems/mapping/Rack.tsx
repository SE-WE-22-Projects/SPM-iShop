import axios from 'axios';
import { useConfirm } from 'material-ui-confirm';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { SectionType } from './sectionComponents/SectionTable';
import Box from '@mui/material/Box';
import SearchBar from '../../common/SearchBar';
import RackTable from './rackcomponents/RackTable';
import Typography from '@mui/material/Typography';
import { invalidCordinate } from '../../common/validCordinate';
import Button from '@mui/material/Button';
import { Add } from '@mui/icons-material';
import RackAddModel from './rackcomponents/RackAddModal';
import PageLoader from '../../common/PageLoader';

const Rack = () => {
    // real time search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const search = (str: string)=>{
    setSearchQuery(str);
    }

    // handle add rack modal
    const [addOpen, setAddOpen] = useState(false);
    const rackAddModalOpen = () => setAddOpen(true);
    const rackAddModalClose = () => setAddOpen(false);

    // handle update rack modal
    const [updateOpen, setUpdateOpen] = useState(false);
    const rackUpdateModalOpen = () => setUpdateOpen(true);
    const rackUpdateModalClose = () => setUpdateOpen(false);

    // get all racks
    const [rackList,setRackList] = useState<any>([]);
    const getAllRacks = async ()=>{
        const res = await axios.get("api/mapping/rack");
        setRackList(res.data);
    }

    //add section
    const addRack = async (data: any)=>{
        console.log(data.sectionId);
        // data validation
        if(!data.sectionId){
            enqueueSnackbar("Section is required...", {variant:  "error"});
            return;
        }
        else if(invalidCordinate(data.top_y)){
            enqueueSnackbar("Rack Top Y cordinate is required...", {variant:  "error"});
            return;
        }
        else if(invalidCordinate(data.top_x)){
            enqueueSnackbar("Rack Top X cordinate is required...", {variant:  "error"});
            return;
        }
        else if(invalidCordinate(data.bottom_y)){
            enqueueSnackbar("Rack Bottom Y cordinate is required...", {variant:  "error"});
            return;
        }
        else if(invalidCordinate(data.bottom_x)){
            enqueueSnackbar("Rack Bottom X cordinate is required...", {variant:  "error"});
            return;
        }
        try{
            await axios.post("api/mapping/rack",data);
            enqueueSnackbar("Rack added successfuly...", {variant:  "success"});
            rackAddModalClose();
            getAllRacks();
        }
        catch(e){
            enqueueSnackbar("failed to add rack...", {variant: "error"});
            console.error(e);
        }
    }

    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        getAllRacks();
        getAllSections();
        setTimeout(()=>setIsLoading(false),1000);
    },[]);

    // confirm box handle
    const confirm = useConfirm();
    
    // upadate section 
    const updateRack = (data: any)=> {
        // data validation
        if(!data.sectionId){
            enqueueSnackbar("Section is required...", {variant:  "error"});
            return;
        }
        else if(isNaN(data.top_y)){
            console.log(isNaN(data.top_y));
            enqueueSnackbar("Rack Top Y cordinate is required...", {variant:  "error"});
            return;
        }
        else if(isNaN(data.top_x)){
            enqueueSnackbar("Rack Top X cordinate is required...", {variant:  "error"});
            return;
        }
        else if(isNaN(data.bottom_y)){
            enqueueSnackbar("Rack Bottom Y cordinate is required...", {variant:  "error"});
            return;
        }
        else if(isNaN(data.bottom_x)){
            enqueueSnackbar("Rack Bottom X cordinate is required...", {variant:  "error"});
            return;
        }
        confirm( {description: "Confirm Rack Details"})
        .then(
            async ()=>{
                try{
                    await axios.put(`api/mapping/rack/${data.id}`,data);
                    enqueueSnackbar("Rack updated successfuly...", {variant:  "success"});
                    rackUpdateModalClose();
                    getAllRacks();
                }
                catch(e){
                    enqueueSnackbar("failed to update rack...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            rackUpdateModalClose();
        })
    }

    // delete section
    const deleteRack = (id: number)=>{
        confirm( {description: "Confirm Delete Rack Details"})
        .then(
            async ()=>{
                try{
                    await axios.delete(`api/mapping/rack/${id}`);
                    enqueueSnackbar("Rack deleted successfuly...", {variant:  "success"});
                    rackUpdateModalClose();
                    getAllRacks();
                }
                catch(e){
                    enqueueSnackbar("failed to delete section...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            rackUpdateModalClose();
        });
    }

    // get all sections
    const [sectionList,setSectionList] = useState<SectionType[]>([]);
    const getAllSections = async ()=>{
        const res = await axios.get("api/mapping/section");
        setSectionList(res.data);
    }

    return (
        <Box>
            {isLoading ? <PageLoader /> :
                <Box>
                    <Typography variant="h3" align="center">Rack Management</Typography>
                    <Box sx={{ display: "flex" }} my={2} mx={15} >
                        <SearchBar onSearch={search} />
                        <Box flexGrow={1}></Box>
                        <Button variant="outlined" startIcon={<Add />} onClick={rackAddModalOpen} >
                            Add Rack
                        </Button>
                    </Box>
                    <RackTable data={rackList} query={searchQuery} sectionData={sectionList} updateOpen={updateOpen} deleteRack={deleteRack} rackUpdateModalOpen={rackUpdateModalOpen} rackUpdateModalClose={rackUpdateModalClose} updateRack={updateRack} />
                    <RackAddModel open={addOpen} handleClose={rackAddModalClose} sectionData={sectionList} addRack={addRack} />
                </Box>
            }
        </Box>
    )
}

export default Rack