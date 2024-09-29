import { useState } from 'react'
import { itemDataTable } from '../itemComponents/ItemTable'
import AllocatedItemTable from './AllocatedItemTable'
import Box from '@mui/material/Box';
import SearchBar from '../../../common/SearchBar';

const ModifyAllocation = ({data,allocation}: {data: itemDataTable[], allocation: (itemID: number,rackId: number)=>void}) => {
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
      <AllocatedItemTable data={data} allocation={allocation} query={searchQuery}/>
    </div>
  )
}

export default ModifyAllocation