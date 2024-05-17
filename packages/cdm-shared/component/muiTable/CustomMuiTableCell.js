import React, {useMemo} from "react";
import classNames from "classnames";
import 'react-table/react-table.css';
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {TableCell} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import get from "lodash/get";
import {formatDate} from "../../utils/date";
import {withLocalization} from "cdm-web-catalog/src/common/redux/hoc/withLocalization";

/**
 * @typedef {'datetime' | 'boolean' | 'boolean-text' | 'inherit'} DataCellType
 */

/**
 * @callback ValueGetter
 * @param {Object} row
 * @returns {String | React.ReactNode}
 */

/**
 * @callback RenderCell
 * @param {Object} params
 * @returns {String | React.ReactNode}
 */

/**
 * @typedef {Object} TableColumn
 * @property {String} id
 * @property {String} label
 * @property {String} className
 * @property {Boolean} sortable
 * @property {DataCellType} dataType
 * @property {String} dateFormat
 * @property {String | function} tooltipDescription
 * @property {ValueGetter} valueGetter
 * @property {RenderCell} renderCell
 */

/**
 * @param {Object} props
 * @param {TableColumn} props.column
 * @param {Object} props.row
 */
const CustomMuiTableCell = ({ column, currentLocaleCode, row }) => {
  /** @type {String | React.ReactNode} */
  const value = useMemo(() => {
    /** @type {String | React.ReactNode} */
    const cellValue = column.valueGetter ? column.valueGetter(row) : get(row, column.id);

    if (column.renderCell) {
      return column.renderCell({ row, column });
    }

    switch (column.dataType) {
      case "datetime":
        const localeFormat =
          currentLocaleCode === "en-GB"
            ? "MM/DD/YYYY HH:MM"
            : currentLocaleCode === "fr-FR"
              ? "DD/MM/YYYY hh:mm"
              : "DD/MM/YYYY HH:MM";
        return formatDate(cellValue, column.dateFormat || localeFormat);
      case "boolean":
        const tooltipTitle = typeof column.tooltipDescription === "function" ? column.tooltipDescription(row) : column.tooltipDescription;
        const icon = cellValue ? <CheckRoundedIcon /> : <CloseRoundedIcon />;
        if (tooltipTitle !== undefined && tooltipTitle !== null) {
          return (
            <Tooltip title={tooltipTitle} placement="top">
              {icon}
            </Tooltip>);
        }
        return icon;
      case "boolean-text":
      default: // "inherit"
        return cellValue;
    }
  }, [column, row])

  return (
    <TableCell key={column.id} className={classNames(column.className, column.sortable && "sortable-data-cell")}>
      {value}
    </TableCell>
  );
}


export default withLocalization(CustomMuiTableCell);
