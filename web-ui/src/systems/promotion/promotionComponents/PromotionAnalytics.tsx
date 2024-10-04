import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import { PromotionType } from './PromotionTable';
import DynamicTable from '../../../common/DynamicTable';

const PromotionAnalytics = ({data}:{data: PromotionType[]}) => {
    const headers = [
        "Promo ID",
        "Name",
        "Description",
        "Status",
        "Percentage",
        "Amount",
        "Start Date",
        "End Date",
        "Item ID"
    ];

    const columns : (keyof PromotionType)[] = [
        'id',
        'name',
        'desc',
        'status',
        'dis_percentage',
        'dis_amount',
        'start_date',
        'end_date',
        'itemId'
    ]

    const filterFunction = (val: any)=>{
        return !(val === null || val === 0 || val === undefined)
    }

  return (
    <Box>
        <Typography variant="h4" align="center">Promotion Details Report</Typography>
        <Box mt={7}>
            <DynamicTable data={data} headers={headers} columns={columns} title='All Promotion Details'></DynamicTable>
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} headers={headers} columns={columns} title='Precentage Based Promotion Details' filterAttribute='dis_percentage' filterCondition={filterFunction}></DynamicTable>
        </Box>
        <Box mt={7}>
            <DynamicTable data={data} headers={headers} columns={columns} title='Amount Based Promotion Details' filterAttribute='dis_amount' filterCondition={filterFunction}></DynamicTable>
        </Box>
    </Box>
    
  )
}

export default PromotionAnalytics