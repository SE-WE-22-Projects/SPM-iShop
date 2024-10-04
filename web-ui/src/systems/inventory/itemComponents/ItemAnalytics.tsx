import React from 'react'
import { itemDataTable } from './ItemTable'
import DynamicTable from '../../../common/DynamicTable'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ItemAnalytics = ({data}:{data:itemDataTable[]}) => {
    const headers = [
        "Item ID",
        "Name",
        "Description",
        "Category",
        "Price",
        "Unit",
        "Quantity"
    ];

    const columns:(keyof itemDataTable)[] = [
        'id',
        'name',
        'desc',
        'category',
        'price',
        'unit',
        'qty'
    ];

    return (
        <div>
            <Typography variant="h4" align="center">Item Details Report</Typography>
            <Box mt={7}>
                <DynamicTable data={data} headers={headers} columns={columns} title='All Item Details'></DynamicTable>
            </Box>
            <Box mt={7}>
                <DynamicTable data={data} headers={headers} columns={columns} title='Grocery Item Details' filterAttribute='category' filterValue='Grocery'></DynamicTable>
            </Box>
            <Box mt={7}>
                <DynamicTable data={data} headers={headers} columns={columns} title='Fruits Item Details' filterAttribute='category' filterValue='Fruits'></DynamicTable>
            </Box>
            <Box mt={7}>
                <DynamicTable data={data} headers={headers} columns={columns} title='Vegetables Item Details' filterAttribute='category' filterValue='Vegetables'></DynamicTable>
            </Box>
            <Box mt={7}>
            <DynamicTable data={data} headers={headers} columns={columns} title='Meat and Seafood Item Details' filterAttribute='category' filterValue='Meat and Seafood'></DynamicTable>
            </Box>
            <Box mt={7}>
                <DynamicTable data={data} headers={headers} columns={columns} title='Cleaning Supplies Item Details' filterAttribute='category' filterValue='Cleaning Supplies'></DynamicTable>
            </Box>
            <Box>
                <DynamicTable data={data} headers={headers} columns={columns} title='Electronics Item Details' filterAttribute='category' filterValue='Electronics'></DynamicTable>
            </Box>
            <Box>
                <DynamicTable data={data} headers={headers} columns={columns} title='Cosmatic Item Details' filterAttribute='category' filterValue='Cosmatic'></DynamicTable>
            </Box>
        </div>
    )
}

export default ItemAnalytics