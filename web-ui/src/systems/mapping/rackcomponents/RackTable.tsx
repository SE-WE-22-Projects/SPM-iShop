import { MoreVert } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import RackUpdateModel from "./RackUpdateModel";


const RackTable = ({data, sectionData, query, updateOpen, rackUpdateModalOpen, rackUpdateModalClose, updateRack, deleteRack}: {data: any, sectionData: any, query: string, updateOpen: boolean, rackUpdateModalOpen: ()=>void, rackUpdateModalClose: ()=>void, updateRack: (data:any)=>void, deleteRack: (id:number)=>void}) => {
  const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const [modalData,setModaldata] = useState<any>({});
    const [sectionId,setSectionId] = useState<number>(0);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Rack Id</TableCell>
                            <TableCell align='center'>Top Y</TableCell>
                            <TableCell align='center'>Top X</TableCell>
                            <TableCell align='center'>Bottom Y</TableCell>
                            <TableCell align='center'>Bottom X</TableCell>
                            <TableCell align='center'>Section ID</TableCell>
                            <TableCell align='center'>Section Name</TableCell>
                            <TableCell size="medium">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .filter((row: any) => {
                                if (query) {
                                    return (row.id.toString()?.toLowerCase()?.startsWith(query));
                                }
                                else {
                                    return row;
                                }
                            })
                            .map((row: any) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell align='center' key={row.id}>{row.id}</TableCell>
                                        <TableCell align='center' key={row.top_y}>{row.top_y}</TableCell>
                                        <TableCell align='center' key={row.top_x}>{row.top_x}</TableCell>
                                        <TableCell align='center' key={row.bottom_y}>{row.bottom_x}</TableCell>
                                        <TableCell align='center' key={row.bottom_x}>{row.bottom_x}</TableCell>
                                        <TableCell align='center' key={row.sectionId}>{row.sectionId}</TableCell>
                                        <TableCell align='center' key={row.section.name}>{row.section.name}</TableCell>
                                        <TableCell size="medium">
                                            <IconButton
                                                color='success'
                                                size='small'
                                                onClick={() => {
                                                    setModaldata(row);
                                                    setSectionId(row.sectionId);
                                                    rackUpdateModalOpen();
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
            {/* <UpdateSectionModel open={updateOpen} handleClose={sectionUpdateModalClose} data={updateModalData} updateSection={updateSection} deleteSection={deleteSection} />  */}
            <RackUpdateModel open={updateOpen} handleClose={rackUpdateModalClose} data={modalData} sectionId={sectionId} sectionData={sectionData} updateRack={updateRack} deleteRack={deleteRack} />
        </Paper>
    )
}

export default RackTable