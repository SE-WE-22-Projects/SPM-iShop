import { MoreVert } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react'
import UpdateSectionModel from './UpdateSectionModel';

export interface SectionType{
    id?: number|null,
    name?: string|null,
    top_x?: number|null,
    top_y?: number|null,
    bottom_x?: number|null,
    bottom_y?: number|null
}

const SectionTable = ({ data, query, updateOpen, sectionUpdateModalOpen, sectionUpdateModalClose, updateSection, deleteSection }: { data: SectionType[], query: string, updateOpen: boolean, sectionUpdateModalOpen: () => void, sectionUpdateModalClose: () => void, updateSection: (sectionData: SectionType) => void, deleteSection: (id: number) => void }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // item update modal data
  const [updateModalData, setUpdateModalData] = useState<SectionType>({});

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Section ID</TableCell>
              <TableCell>Section Name</TableCell>
              <TableCell align='center'>Top Y</TableCell>
              <TableCell align='center'>Top X</TableCell>
              <TableCell align='center'>Bottom Y</TableCell>
              <TableCell align='center'>Bottom X</TableCell>
              <TableCell size="medium">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((row: SectionType) => {
                if (query) {
                  return (row.name?.toLowerCase()?.startsWith(query));
                }
                else {
                  return row;
                }
              })
              .map((row: SectionType) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align='center' key={row.id}>{row.id}</TableCell>
                    <TableCell key={row.name}>{row.name}</TableCell>
                    <TableCell align='center' key={row.top_y}>{row.top_y}</TableCell>
                    <TableCell align='center' key={row.top_x}>{row.top_x}</TableCell>
                    <TableCell align='center' key={row.bottom_y}>{row.bottom_x}</TableCell>
                    <TableCell align='center' key={row.bottom_x}>{row.bottom_x}</TableCell>
                    <TableCell size="medium">
                      <IconButton
                        color='success'
                        size='small'
                        onClick={() => {
                          setUpdateModalData(row);
                          sectionUpdateModalOpen();
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
      {/* <UpdateEmployeeModal open={updateOpen} handleClose={employeeUpdateModalClose} data={updateModalData} updateEmployee={updateEmployee} deleteEmployee={deleteEmployee} /> */}
      <UpdateSectionModel open={updateOpen} handleClose={sectionUpdateModalClose} data={updateModalData} updateSection={updateSection} deleteSection={deleteSection} /> 
    </Paper>
  )
}

export default SectionTable