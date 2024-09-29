import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton } from "@mui/material";
import {MoreVert} from '@mui/icons-material';
import { useState } from "react";
import UpdateItemModal, { updateItemType } from "./UpdateItemModal";

export interface itemDataTable{
    id?: number;
    name?: string;
    desc?: string;
    category?: string,
    unit?: string,
    price?: number;
    qty?: number;
    rackId?: number;
}

const ItemTable = ({data, query, updateItem, deleteItem, updateOpen, itemUpdateModalOpen, itemUpdateModalClose}:{data: itemDataTable[], query: string, updateItem: (data:updateItemType)=>void, deleteItem: (id:number|null)=>void, updateOpen:boolean, itemUpdateModalOpen: ()=>void, itemUpdateModalClose: ()=>void}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    // item update modal data
    const [updateModalData,setUpdateModalData] = useState<itemDataTable>({});
  
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
                                  setUpdateModalData(row);
                                  itemUpdateModalOpen();
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
        {/* update modal */}
        <UpdateItemModal open={updateOpen} handleClose={itemUpdateModalClose} data={updateModalData} updateItem={updateItem} deleteItem={deleteItem} />
      </Paper>
    );
}

export default  ItemTable;