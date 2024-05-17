import React, { useMemo } from "react";
import { Input } from "cdm-ui-components";
import { cloneDeep, set } from "lodash";
import { Row } from "cdm-ui-components";
import withUser from "cdm-shared/redux/hoc/withUser";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { DataGridPremium, GridRowModes } from "@mui/x-data-grid-premium";
import "./index.css";
import toNumber from "lodash/toNumber";
import find from "lodash/find";

const PriceMatrixAnalysisForm = ({
  matrixAnalysisForm,
  setMatrixAnalysisForm,
  editable = true,
  translate,
}) => {
  const sheets = matrixAnalysisForm
    ? cloneDeep(matrixAnalysisForm.file.sheets).map((sheet) => ({
        ...sheet,
        id: sheet.sheetIndex,
      }))
    : [];

  const columns = [
    {
      field: "ignored",
      type: "checkbox",
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: "left",
      renderHeader: (params) => {
        return (
          <div className="price-matrix-analysis-ignored-header">
            <Input
              type="checkbox"
              onChange={(e) => {
                const newMatrixAnalysis = cloneDeep(matrixAnalysisForm);
                newMatrixAnalysis.file.sheets =
                  newMatrixAnalysis.file.sheets.map((sheet) => ({
                    ...sheet,
                    ignored: e.target.checked,
                  }));
                setMatrixAnalysisForm(newMatrixAnalysis);
              }}
              checked={sheets.every((sheet) => sheet.ignored)}
              disabled={!editable}
              block
              className="price-matrix-analysis-ignored-checkbox price-matrix-analysis-ignored-header-checkbox"
            />
            <p className="MuiDataGrid-columnHeaderTitle">
              {translate("collections.ignored")}?
            </p>
          </div>
        );
      },
      renderEditCell: (params) => {
        return (
          <Input
            type="checkbox"
            onChange={(e) => {
              onChangeSheet(params.row.id, {
                ...params.row,
                ignored: e.target.checked,
              });
            }}
            checked={find(sheets, { id: params.row.id }).ignored}
            disabled={!editable}
            block
            className="price-matrix-analysis-ignored-checkbox"
          />
        );
      },
    },
    {
      field: "sheetName",
      headerName: translate("collections.sheetName"),
      type: "text",
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderEditCell: (params) => {
        return (
          <Input
            type="text"
            onChange={(e) => {
              onChangeSheet(params.row.id, {
                ...params.row,
                sheetName: e.target.value,
              });
            }}
            value={find(sheets, { id: params.row.id }).sheetName}
            block
            disabled={params.row.ignored || !editable}
            className={
              params.row.ignored
                ? "datagrid-disabled-row"
                : "price-matrix-analysis-input"
            }
          />
        );
      },
    },
    {
      field: "headerStartingRowNumber",
      headerName: translate("collections.headerStartingRow"),
      type: "number",
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderEditCell: (params) => {
        return (
          <Input
            type="number"
            onChange={(e) => {
              onChangeSheet(params.row.id, {
                ...params.row,
                headerStartingRowNumber: toNumber(e.target.value),
              });
            }}
            value={find(sheets, { id: params.row.id }).headerStartingRowNumber}
            block
            disabled={params.row.ignored || !editable}
            className={
              params.row.ignored
                ? "datagrid-disabled-row"
                : "price-matrix-analysis-input"
            }
          />
        );
      },
    },
    {
      field: "headerStartingColNumber",
      headerName: translate("collections.headerStartingColumn"),
      type: "number",
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderEditCell: (params) => {
        return (
          <Input
            type="number"
            onChange={(e) => {
              onChangeSheet(params.row.id, {
                ...params.row,
                headerStartingColNumber: toNumber(e.target.value),
              });
            }}
            value={find(sheets, { id: params.row.id }).headerStartingColNumber}
            block
            disabled={params.row.ignored || !editable}
            className={
              params.row.ignored
                ? "datagrid-disabled-row"
                : "price-matrix-analysis-input"
            }
          />
        );
      },
    },
    {
      field: "dataStartingRowNumber",
      headerName: translate("collections.dataStartingRow"),
      type: "number",
      editable: true,
      sortable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderEditCell: (params) => {
        return (
          <Input
            type="number"
            onChange={(e) => {
              onChangeSheet(params.row.id, {
                ...params.row,
                dataStartingRowNumber: toNumber(e.target.value),
              });
            }}
            value={find(sheets, { id: params.row.id }).dataStartingRowNumber}
            block
            disabled={params.row.ignored || !editable}
            className={
              params.row.ignored
                ? "datagrid-disabled-row"
                : "price-matrix-analysis-input"
            }
          />
        );
      },
    },
  ];

  const onChangeSheet = (index, sheet) => {
    const newMatrixAnalysis = cloneDeep(matrixAnalysisForm);
    set(newMatrixAnalysis, `file.sheets.${index}`, sheet);
    setMatrixAnalysisForm(newMatrixAnalysis);
  };

  const rowModesModel = useMemo(() => {
    return sheets.reduce((acc, sheet) => {
      acc[sheet.id] = {
        mode: GridRowModes.Edit,
      };
      return acc;
    }, {});
  }, [sheets]);

  return (
    <div>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Row>
      {matrixAnalysisForm && (
        <>
          <DataGridPremium
            columns={columns}
            rows={sheets}
            editMode="cell"
            rowModesModel={rowModesModel}
            className="price-matrix-analysis-datagrid"
            getRowClassName={(params) => {
              return params.row.ignored ? "datagrid-disabled-row" : "";
            }}
            pagination={false}
            rowSelection={false}
            disableColumnMenu
            hideFooter
          />
        </>
      )}
    </div>
  );
};

export default withUser(withLocalization(PriceMatrixAnalysisForm));
