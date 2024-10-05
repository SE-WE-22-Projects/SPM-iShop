import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from '../../common/CustomTabPanel';
import AllocationOverView from './allocationComponents/AllocationOverView';
import Allocation from './allocationComponents/Allocation';
import ModifyAllocation from './allocationComponents/ModifyAllocation';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import { itemDataTable } from './itemComponents/ItemTable';
import { useConfirm } from 'material-ui-confirm';
import { enqueueSnackbar } from 'notistack';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ItemAllocation() {
  const [value, setValue] = React.useState(0);
  // api data holders
  const [unallocatedItemList,setUnallocatedItemList] = React.useState<itemDataTable[]>([]);
  const [allocatedItemList,setAllocatedItemList] = React.useState<itemDataTable[]>([]);
  const [rackList,setRackList] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // get unallocated item details
  const getUnallocatedItems = async ()=>{
    const res = await axios.get("api/inventory/items/unallocated");
    setUnallocatedItemList(res.data);
  }

  // get allocated item details
  const getAllocatedItems = async () => {
    const res = await axios.get("api/inventory/items/allocated");
    setAllocatedItemList(res.data);
  }

  // get all rack details
  const getAllRackDetails = async ()=> {
    const res = await axios.get("api/mapping/rack");
    setRackList(res.data);
  }

  // confirm box handle
  const confirm = useConfirm();

  // allocate item to rack
  const allocateItemToRack = async(itemId: number|null,rackId: number|null)=> {
    confirm({description: "Confirm Item Allocation"})
    .then(
      async()=>{
        try{
          await axios.put(`api/inventory/items/allocate/${itemId}`,{rackId: rackId});
          enqueueSnackbar("Item allocated successfuly...", {variant:  "success"});
          handleClose();
          getAllocatedItems();
          getUnallocatedItems();
        }
        catch(e){
          enqueueSnackbar("failed to allocate item...", {variant: "error"});
          console.error(e);
        }
      }
    )
    .catch((e)=>{
      handleClose();
    }); 
  }

  // allocation modal handle
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const [isLoading,setIsLoading] = useState<boolean>(true);
  useEffect(()=>{
    getAllocatedItems();
    getUnallocatedItems();
    getAllRackDetails();
  },[]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" align="center">Manage Allocations</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {/* <Tab label="Overview" {...a11yProps(0)} /> */}
          <Tab label="Allocate Item" {...a11yProps(0)} />
          <Tab label="Modify Allocation" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {/* <CustomTabPanel value={value} index={0}>
        Need to add overview content
        <AllocationOverView />
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={0}>
        <Allocation data={unallocatedItemList} allocation={allocateItemToRack} handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} rackList={rackList} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ModifyAllocation data={allocatedItemList} allocation={allocateItemToRack} handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} rackList={rackList}/>
      </CustomTabPanel>
    </Box>
  );
}