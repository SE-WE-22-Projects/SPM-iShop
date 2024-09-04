import { Skeleton, TableCell, TableRow } from "@mui/material";

interface TablePlaceholderProps {
    /**
     * The number of columns in the table.
     */
    columns: number;
    /**
     * The number of rows in the table.
     * Defaults to 10.
     */
    rows?: number
}

/**
 * Generates placeholder data for a table
 */
const TablePlaceholder = ({ columns, rows }: TablePlaceholderProps) => {
    if (!rows) rows = 10;

    let data = [];
    for (let i = 0; i < 10; i++) {
        let rows = [];
        for (let c = 0; c < columns; c++) {
            rows.push(
                <TableCell><Skeleton /></TableCell>);
        }
        data.push(<TableRow>
            {rows}
        </TableRow>)
    }

    return <>{data}</>;
}

export default TablePlaceholder;