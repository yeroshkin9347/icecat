import React from "react";
import { isNil } from "lodash";
import { DataGrid } from "@mui/x-data-grid";
import DataGridFooter from "./DataGridFooter";

export const CdmDataGrid = (props) => {
  const {
    rows,
    disableColumnMenu = true,
    columns,
    loading = false,
    checkboxSelection = false,
    rowSelection = false,
    pageSizeOptions = [20, 50, 100, 200],
    paginationModel,
    rowCount,
    paginationMode = "server",
    getRowId,
    onPaginationModelChange,
    onRefresh,
    hideFooter,
  } = props;

  return (
    <DataGrid
      rows={rows}
      getRowId={getRowId}
      disableColumnMenu={disableColumnMenu}
      columns={columns}
      loading={loading}
      checkboxSelection={checkboxSelection}
      rowSelection={rowSelection}
      pageSizeOptions={pageSizeOptions}
      onPaginationModelChange={onPaginationModelChange}
      paginationModel={{
        page: paginationModel?.page,
        pageSize: paginationModel?.pageSize,
      }}
      hideFooter={hideFooter}
      rowCount={rowCount}
      paginationMode={paginationMode}
      slots={{
        footer: DataGridFooter
      }}
      slotProps={{
        footer: {
          pageNumber: paginationModel?.page,
          pageSize: paginationModel?.pageSize,
          rowCount: rowCount,
          pageSizeOptions,
          onPageChange: (page, pageSize) => {
            onPaginationModelChange({ pageSize, page });
          },
          onRefresh: isNil(onRefresh) ? undefined : (page, pageSize) => {
            onRefresh({ pageSize, page });
          },
        }
      }}
      localeText={{
        noRowsLabel: "No rows"
      }}
      sx={{
        "--unstable_DataGrid-headWeight": 700,
        "color": "#000",
        "fontSize": "1rem",
        "backgroundColor": "#fff",
        ".MuiDataGrid-virtualScrollerContent": {
          minHeight: "90px !important",
        },
        ".MuiDataGrid-cell": {
          "&:focus": {
            outline: "none",
          },
          "&:focus-within": {
            outline: "none",
          },
        }
      }}
    />
  );
};
