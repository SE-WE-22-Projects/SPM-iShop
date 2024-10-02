import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import SearchBar from '../../common/SearchBar'
import Button from '@mui/material/Button'
import { Add } from '@mui/icons-material'
import SectionTable, { SectionType } from './sectionComponents/SectionTable'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { useConfirm } from 'material-ui-confirm'
import PageLoader from '../../common/PageLoader'

const Section = () => {
    // real time search
    const [searchQuery, setSearchQuery] = useState<string>("");
    const search = (str: string)=>{
    setSearchQuery(str);
    }

    // handle add employee modal
    const [addOpen, setAddOpen] = useState(false);
    const sectionAddModalOpen = () => setAddOpen(true);
    const sectionAddModalClose = () => setAddOpen(false);

    // handle update section modal
    const [updateOpen, setUpdateOpen] = useState(false);
    const sectionUpdateModalOpen = () => setUpdateOpen(true);
    const sectionUpdateModalClose = () => setUpdateOpen(false);

    // get all sections
    const [sectionList,setSectionList] = useState<SectionType[]>([]);
    const getAllSections = async ()=>{
        const res = await axios.get("api/mapping/section");
        setSectionList(res.data);
    }

    //add section
    const addSection = async (data: SectionType)=>{
        // data validation
        if(!data.name){
            enqueueSnackbar("Section Name is required...", {variant:  "error"});
            return;
        }
        else if(!data.top_y){
            enqueueSnackbar("Section Top Y cordination is required...", {variant:  "error"});
            return;
        }
        else if(!data.top_x){
            enqueueSnackbar("Section Top X cordination is required...", {variant:  "error"});
            return;
        }
        else if(!data.bottom_y){
            enqueueSnackbar("Section Bottom Y is required...", {variant:  "error"});
            return;
        }
        else if(!data.bottom_x){
            enqueueSnackbar("Section Bottom X is required...", {variant:  "error"});
            return;
        }
        try{
            await axios.post("api/mapping/section",data);
            enqueueSnackbar("Section added successfuly...", {variant:  "success"});
            sectionAddModalClose();
            getAllSections();
        }
        catch(e){
            enqueueSnackbar("failed to add section...", {variant: "error"});
            console.error(e);
        }
    }

    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        getAllSections();
        setTimeout(()=>setIsLoading(false),1000);
    },[]);


    // confirm box handle
    const confirm = useConfirm();
    
    // upadate section 
    const updateSection = (data: SectionType)=> {
        // data validation
        if(!data.name){
            enqueueSnackbar("Section Name is required...", {variant:  "error"});
            return;
        }
        else if(!data.top_y){
            enqueueSnackbar("Section Top Y cordination is required...", {variant:  "error"});
            return;
        }
        else if(!data.top_x){
            enqueueSnackbar("Section Top X cordination is required...", {variant:  "error"});
            return;
        }
        else if(!data.bottom_y){
            enqueueSnackbar("Section Bottom Y is required...", {variant:  "error"});
            return;
        }
        else if(!data.bottom_x){
            enqueueSnackbar("Section Bottom X is required...", {variant:  "error"});
            return;
        }
        confirm( {description: "Confirm Section Details"})
        .then(
            async ()=>{
                try{
                    await axios.put(`api/mapping/section/${data.id}`,data);
                    enqueueSnackbar("Section updated successfuly...", {variant:  "success"});
                    sectionUpdateModalClose();
                    getAllSections();
                }
                catch(e){
                    enqueueSnackbar("failed to update section...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            sectionUpdateModalClose();
        })
    }

    // delete section
    const deleteSection = (id: number)=>{
        confirm( {description: "Confirm Delete Section Details"})
        .then(
            async ()=>{
                try{
                    await axios.delete(`api/mapping/section/${id}`);
                    enqueueSnackbar("Section deleted successfuly...", {variant:  "success"});
                    sectionUpdateModalClose();
                    getAllSections();
                }
                catch(e){
                    enqueueSnackbar("failed to delete section...", {variant: "error"});
                    console.error(e);
                }
            } 
        )
        .catch((e)=>{
            sectionUpdateModalClose();
        });
    }

    return (
        <div>
            {isLoading ? <PageLoader /> :
                <div>
                    <Typography variant="h3" align="center"> Section Management</Typography>
                    <Box sx={{ display: "flex" }} my={2} mx={15} >
                        <SearchBar onSearch={search} />
                        <Box flexGrow={1}></Box>
                        <Button variant="outlined" startIcon={<Add />} onClick={sectionAddModalOpen} >
                            Add Section
                        </Button>
                    </Box>
                    <SectionTable data={sectionList} query={searchQuery} updateOpen={updateOpen} sectionUpdateModalOpen={sectionUpdateModalOpen} sectionUpdateModalClose={sectionUpdateModalClose} updateSection={updateSection} deleteSection={deleteSection} />
                </div>
            }
        </div>
    )
}

export default Section