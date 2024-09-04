import { Skeleton, TableCell, TableRow } from "@mui/material";

/**
 * Generates placeholder data for a table
 */
export default ({ columns }: { columns: number }) => {
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