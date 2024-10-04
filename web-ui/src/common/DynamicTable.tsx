import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface TableProps<T> {
  data: T[],
  headers: string[],
  columns: (keyof T)[],
  filterAttribute?: keyof T, // Optional
  filterValue?: string, // Optional
  filterCondition?: (value: T[keyof T]) => boolean; //Optional
  title : string
}

export default function DynamicTable<T>({data, headers, columns, filterAttribute, filterValue, filterCondition, title}: TableProps<T>) {
  // Apply filtering if filterAttribute and filterValue are provided
  const filteredData = filterAttribute && (filterValue || filterCondition)
  ? data.filter((item) => {
      const value = item[filterAttribute];
      if (filterCondition) {
        return filterCondition(value); // Use custom filterCondition if provided
      }
      if (filterValue) {
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      }
      return true;
    })
  : data;

    return (
        <Box>
            <Typography variant="h4" align="center">{title}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
                                <TableCell key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex}>{String(row[column])}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
