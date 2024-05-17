import React, { useMemo } from "react";
import get from "lodash/get";
import Table, { TableCellWithTooltip } from "cdm-shared/component/Table";
import isEmpty from "lodash/isEmpty";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { TableActionsWrapper } from "../table/styles";
import { IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const Identity = ({
  tradeItem,
  selectedVariantIndex,
  // functions
  removeTradeItemValue,
  onEdit,
  translate,
}) => {
  const identityPath =
    selectedVariantIndex !== null
      ? `variantDefinitions.${selectedVariantIndex}.identities`
      : `identities`;
  const finalIdentities = get(tradeItem, identityPath, []);
  if (finalIdentities && finalIdentities.length === 0) {
    return (
      <div>
        <label>{"No Data"}</label>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: translate("tradeItemCrud.identity.gtin"),
        id: "gtin",
        accessor: "gtin.value",
        Cell: TableCellWithTooltip,
      },
      {
        Header: translate("tradeItemCrud.identity.manufacturerCode"),
        id: "tradeItemManufacturerCode",
        accessor: "tradeItemManufacturerCode",
        Cell: TableCellWithTooltip,
      },
      {
        Header: translate("tradeItemCrud.identity.marketCode"),
        id: "marketCode",
        accessor: "marketCode",
        Cell: TableCellWithTooltip,
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ index, original }) => {
          return (
            <TableActionsWrapper>
              {!isEmpty(original) && (
                <IconButton
                  color="primary"
                  size="large"
                  aria-label="Edit channel"
                  sx={{
                    padding: 0.5,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit && onEdit(index);
                  }}
                >
                  <EditIcon fontSize="medium" />
                </IconButton>
              )}

              <IconButton
                color="error"
                size="large"
                aria-label="Delete channel"
                sx={{
                  padding: 0.5,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeTradeItemValue &&
                    removeTradeItemValue(identityPath, index);
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </TableActionsWrapper>
          );
        },
      },
    ],
    [translate, onEdit, removeTradeItemValue]
  );

  return (
    <Table
      columns={columns}
      data={finalIdentities}
      manual
      sortable={false}
      showFilters={false}
      showPagination={false}
      showPageSizeOptions={false}
      defaultPageSize={0}
    />
  );
};

export default React.memo(withLocalization(Identity));
