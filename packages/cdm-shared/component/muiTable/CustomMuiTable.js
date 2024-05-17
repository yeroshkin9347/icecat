import React, { useState } from "react"
import 'react-table/react-table.css'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import {Paper, TableCell} from "@mui/material";

import CustomMuiTableRow from "./CustomMuiTableRow";
import CustomMuiTableHead from "./CustomMuiTableHead";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

import "./customMuiTable.css";
import TableRow from "@mui/material/TableRow";

/**
 * @param {Object} props
 * @property {Array<TableColumn>} props.columns
 * @property {Array<Object>} props.data
 * @property {String | undefined} props.order
 * @property {String | undefined} props.orderBy
 * @property {Number} props.page
 * @property {Number} props.pageSize
 * @property {Number} props.totalCount
 * @property {function(any): React.ReactNode} props.renderExpansionPanel
 * @property {function(React.MouseEvent, Number): void} props.onPageChange
 * @property {function(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void} props.onPageSizeChange
 * @property {function(String): void} props.onRequestSort
 */

const CustomMuiTable = props => {
  const { translate, columns, data, order, orderBy, page, pageSize, totalCount, loading, renderExpansionPanel, onExpandRows, onPageChange, onPageSizeChange, onRequestSort } = props;
  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpand = (row) => {
    let newExpandedRows;
    if (expandedRows.find((expandedRow) => expandedRow.id === row.id)) {
      newExpandedRows = expandedRows.filter((expandedRow) => expandedRow.id !== row.id);
    } else {
      newExpandedRows  = [...expandedRows, row];
    }
    setExpandedRows(newExpandedRows);
    onExpandRows && onExpandRows(newExpandedRows);
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table aria-label="collapsible table">
          <CustomMuiTableHead columns={columns} order={order} orderBy={orderBy} onRequestSort={onRequestSort} />
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', p: 5 }}>{translate('common.loading')} ...</TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <CustomMuiTableRow
                  key={row.id}
                  expandable={row.matched}
                  columns={columns}
                  row={row}
                  renderExpansionPanel={renderExpansionPanel}
                  onExpandClick={() => handleExpand(index)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount || data.length}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPageSizeChange}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  )
}

export default CustomMuiTable
