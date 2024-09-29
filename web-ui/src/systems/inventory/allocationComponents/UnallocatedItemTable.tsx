import React, { useState } from 'react'
import { itemDataTable } from '../itemComponents/ItemTable'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import AllocationModal from './AllocationModal';

const UnallocatedItemTable = ({data, allocation, query, handleClickOpen, handleClose, open}: {data: itemDataTable[], allocation: (itemID: number,rackId: number)=>void, query: string, handleClickOpen: ()=>void, handleClose: ()=>void, open: boolean}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const [modalData,setModaldata] = useState<itemDataTable>({});

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
        <TableContainer sx={{ maxHeight: 440, }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                    <TableCell>Item ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell size="medium">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((row: itemDataTable)=>{
                    if(query){
                        return (row.name?.toLowerCase()?.startsWith(query));
                    }
                    else{
                        return row;
                    }
                })
                .map((row : itemDataTable) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell key={row.id}>{row.id}</TableCell>
                        <TableCell key={row.name}>{row.name}</TableCell>
                        <TableCell key={row.desc}>{row.desc}</TableCell>
                        <TableCell key={row.category}>{row.category}</TableCell>
                        <TableCell key={row.price}>{row.price}</TableCell>
                        <TableCell key={row.unit}>{row.unit}</TableCell>
                        <TableCell key={row.qty}>{row.qty}</TableCell>
                        <TableCell size="medium">
                            <IconButton
                                color='success'
                                size='small'
                                onClick={() => {
                                    setModaldata(row);
                                    handleClickOpen()
                                }}
                            >
                                <MoreVert />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <AllocationModal handleClose={handleClose} open={open} allocation={allocation} data={modalData} />
      </Paper>
  )
}

export default UnallocatedItemTable