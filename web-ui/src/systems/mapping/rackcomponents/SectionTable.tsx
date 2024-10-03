import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";


const SectionTable = ({data, setSelectedRow, handleClose}: {data: any, setSelectedRow: (row:any)=>void, handleClose: ()=>void }) => {
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
    <Paper sx={{ width: '180hv', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
      <TableContainer sx={{ maxHeight: 440, maxWidth: 900}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
            <TableCell>Section ID</TableCell>
              <TableCell>Section Name</TableCell>
              <TableCell align='center'>Top Y</TableCell>
              <TableCell align='center'>Top X</TableCell>
              <TableCell align='center'>Bottom Y</TableCell>
              <TableCell align='center'>Bottom X</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id} onClick={() => {
                    setSelectedRow(row);
                    handleClose();
                  }} >
                    <TableCell align='center' key={row.id}>{row.id}</TableCell>
                    <TableCell key={row.name}>{row.name}</TableCell>
                    <TableCell align='center' key={row.top_y}>{row.top_y}</TableCell>
                    <TableCell align='center' key={row.top_x}>{row.top_x}</TableCell>
                    <TableCell align='center' key={row.bottom_y}>{row.bottom_x}</TableCell>
                    <TableCell align='center' key={row.bottom_x}>{row.bottom_x}</TableCell>
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
  )
}

export default SectionTable;