import React from "react"
import ReactTable from "react-table"
import 'react-table/react-table.css'
import includes from 'lodash/includes'
import get from 'lodash/get'
import { Button, Icon } from "cdm-ui-components";
import { ic_navigate_before } from 'react-icons-kit/md/ic_navigate_before'
import { ic_navigate_next } from 'react-icons-kit/md/ic_navigate_next'
import Tooltip from '@mui/material/Tooltip';

const filterStringValueLowerCase = (filter, row) => {
    const id = filter.pivotId || filter.id
    return get(row, id) !== undefined ? includes((get(row, id).toLowerCase()), get(filter, 'value').toLowerCase()) : true
}

const Table = props => (
    <ReactTable
        defaultFilterMethod={filterStringValueLowerCase}
        getProps={(state, rowInfo, column) => {
            return {
                style: {
                    borderRadius: '1em',
                    boxShadow: '0 0px 30px 0px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden'
                }
            }
        }}
        getTheadThProps={(state, rowInfo, column) => {
            return {
                style: {
                    paddingTop: '12px',
                    paddingBottom: '12px'
                }
            }
        }}
        getPaginationProps={(state, rowInfo, column) => {
            return {
                style: {
                    borderTop: 'none'
                }
            }
        }}
        getTbodyProps={() => {
            return {
                style: {
                    overflowX: 'hidden'
                }
            }
        }}
        PreviousComponent={p => (
            <Button light small block {...p}>
                <Icon
                    size={20}
                    icon={ic_navigate_before}
                    />
            </Button>
        )}
        NextComponent={p => (
            <Button light small block {...p}>
                <Icon
                    size={20}
                    icon={ic_navigate_next}
                    />
            </Button>
        )}
        {...props}
    />
)

export const TableCellWithTooltip = (cell) => (
    <TableCellWithTooltipComponent value={cell.value} />
)

export const TableCellWithTooltipComponent = ({ value }) => (
    <Tooltip title={value}>
        <span>{value}</span>
    </Tooltip>
)

export default Table
