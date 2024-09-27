import { MoreVert } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import UpdatePromotionModal from './UpdatePromotionMaodal';

export interface PromotionType{
    id?: number|null;
    name?: string|null;
    desc?: string|null;
    status?: boolean;
    dis_percentage?: number|null;
    dis_amount?: number|null;
    start_date?: Dayjs|null;
    end_date?: Dayjs|null;
    itemId?: number|null;
}

const PromotionTable = ({data, query, updatePromotion, deletePromotion, updateOpen, promoUpdateModalOpen, promoUpdateModalClose}:{data: PromotionType[], query: string, updatePromotion: (data: PromotionType)=>Promise<boolean>, deletePromotion :(id:number|null)=>void, updateOpen: boolean, promoUpdateModalOpen: ()=>void, promoUpdateModalClose: ()=>void})=>{
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    // promotion update modal data
    const [updateModalData,setUpdateModalData] = useState<PromotionType>({});

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                        <TableCell>Promo ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Percentage</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Item ID</TableCell>
                        <TableCell size="medium">Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .filter((row: PromotionType)=>{
                        if(query){
                            return (row.name?.startsWith(query));
                        }
                        else{
                            return row;
                        }
                    })
                    .map((row : PromotionType) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            <TableCell key={row.id}>{row.id}</TableCell>
                            <TableCell key={row.name}>{row.name}</TableCell>
                            <TableCell key={row.desc}>{row.desc}</TableCell>
                            <TableCell key={row.id}>{(row.status)?"Active":"Inactive"}</TableCell>
                            <TableCell key={row.dis_percentage}>{row.dis_percentage ?? "N/A"}</TableCell>
                            <TableCell key={row.dis_amount}>{row.dis_amount ?? "N/A"}</TableCell>
                            <TableCell >{dayjs(row.start_date).format('YYYY-MM-DD')}</TableCell>
                            <TableCell >{dayjs(row.end_date).format('YYYY-MM-DD')}</TableCell>
                            <TableCell key={row.itemId}>{row.itemId}</TableCell>
                            <TableCell size="medium">
                                <IconButton
                                    color='success'
                                    size='small'
                                    onClick={() => {
                                        setUpdateModalData(row);
                                        promoUpdateModalOpen();
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
            <UpdatePromotionModal open={updateOpen} handleClose={promoUpdateModalClose} data={updateModalData} updatePromotion={updatePromotion} deletePromotion={deletePromotion} />
        </Paper>
    )
}

export default PromotionTable