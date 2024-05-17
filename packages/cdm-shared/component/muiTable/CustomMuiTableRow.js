import React, {useState} from "react"
import 'react-table/react-table.css'
import {IconButton, TableCell, TableRow} from "@mui/material";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import CustomMuiTableCell from "./CustomMuiTableCell";

const CustomMuiTableRow = ({ columns, row, expandable, renderExpansionPanel, onExpandClick }) => {
  const [opened, setOpened] = useState(false);

  const handleExpandClick = () => {
    setOpened(!opened);
    onExpandClick();
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {expandable && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleExpandClick}
            >
              {opened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        {columns.map((col) => (
          <CustomMuiTableCell key={col.id} column={col} row={row} />
        ))}
      </TableRow>

      {opened && (
        <TableRow>
          <TableCell />
          <TableCell colSpan={columns.length}>
            {renderExpansionPanel(row)}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}


export default CustomMuiTableRow
