import { useState } from 'react'
import { itemDataTable } from '../itemComponents/ItemTable'
import UnallocatedItemTable from './UnallocatedItemTable'
import Box from '@mui/material/Box'
import SearchBar from '../../../common/SearchBar'

const Allocation = ({data, allocation, handleClickOpen, handleClose, open, rackList}: {data: itemDataTable[], allocation: (itemID: number,rackId: number)=>void, handleClickOpen: ()=>void, handleClose: ()=>void, open: boolean, rackList: any}) => {
  // real time search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const search = (str: string)=>{
      setSearchQuery(str);
  }
  
  return (
    <div>
      Allocation
      <Box sx={{ display: "flex" }} my={2} mx={15} >
          <SearchBar onSearch={search} />
      </Box>
      <UnallocatedItemTable data={data} allocation={allocation} query={searchQuery} handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} rackList={rackList} />
      </div>
  )
}

export default Allocation