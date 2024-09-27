import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton } from "@mui/material";
import { useState } from "react";
import { itemDataTable } from "../../inventory/itemComponents/ItemTable";



const ItemTable = ({data, setSelectedRow, handleClose}:{data: itemDataTable[], setSelectedRow: (data:itemDataTable)=>void, handleClose: ()=>void}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

  
    return (
        <Paper sx={{ width: '220hv', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: itemDataTable) => {
                                return (
                                    <TableRow hover tabIndex={-1} key={row.id} onClick={()=>{
                                        setSelectedRow(row);
                                        handleClose();
                                    }} >
                                        <TableCell key={row.id}>{row.id}</TableCell>
                                        <TableCell key={row.name}>{row.name}</TableCell>
                                        <TableCell key={row.desc}>{row.desc}</TableCell>
                                        <TableCell key={row.category}>{row.category}</TableCell>
                                        <TableCell key={row.price}>{row.price}</TableCell>
                                        <TableCell key={row.unit}>{row.unit}</TableCell>
                                        <TableCell key={row.qty}>{row.qty}</TableCell>
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
        </Paper>
    );
}

export default  ItemTable;