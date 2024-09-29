import { useState } from 'react'
import { itemDataTable } from '../itemComponents/ItemTable'
import AllocatedItemTable from './AllocatedItemTable'
import Box from '@mui/material/Box';
import SearchBar from '../../../common/SearchBar';

const ModifyAllocation = ({data, allocation, handleClickOpen, handleClose, open, rackList}: {data: itemDataTable[], allocation: (itemID: number,rackId: number)=>void, handleClickOpen: ()=>void, handleClose: ()=>void, open: boolean, rackList: any}) => {
  // real time search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const search = (str: string)=>{
      setSearchQuery(str);
  }

  return (
    <div>
      <Box sx={{ display: "flex" }} my={2} mx={15} >
          <SearchBar onSearch={search} />
      </Box>
      <AllocatedItemTable data={data} allocation={allocation} query={searchQuery} handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} rackList={rackList} />
    </div>
  )
}

export default ModifyAllocation