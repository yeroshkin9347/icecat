import React from "react"
import 'react-table/react-table.css'
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

/**
 * @param {Object} props
 * @param {Array<TableColumn>} props.columns
 * @param {'asc' | 'desc'} props.order
 * @param {String} props.orderBy
 * @param {function(String): void} props.onRequestSort
 */
const CustomMuiTableHead = (props) => {
  const { columns, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => () => {
    if (onRequestSort) {
      onRequestSort(property);
    }
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === column.id ? order : false}
            className={column.className}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


export default CustomMuiTableHead
