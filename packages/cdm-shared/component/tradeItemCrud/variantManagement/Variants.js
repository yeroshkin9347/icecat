import React, { useMemo, useState } from "react";
import Table, { TableCellWithTooltip } from "cdm-shared/component/Table";
import { Row, Button, Modal, Col, H5, Margin } from "cdm-ui-components";
import isEmpty from "lodash/isEmpty";
import { BLUELIGHT } from "../../color";
import { TableActionsWrapper, TableHeaderAlignLeft } from "../table/styles";
import { isNil } from "lodash";
import { sortVariants } from "./variantManagement.helpers";
import { IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddIcon,
} from "@mui/icons-material";

const Variants = ({
  tradeItem,
  selectedVariantIndex,
  // functions
  setSelectedVariantIndex,
  removeTradeItemValue,
  onAdd,
  onEdit,
  translate,
}) => {
  const [variantIndexToDelete, setVariantIndexToDelete] = useState(null);

  const { variantDefinitions = [] } = tradeItem;

  const columns = useMemo(
    () => [
      {
        Header: (
          <TableHeaderAlignLeft>
            {translate("tradeItemCrud.variant.edition")}
          </TableHeaderAlignLeft>
        ),
        Cell: ({ original }) => {
          return original.options["75"] ? "" : original.options[8410];
        },
        className: "cursor-pointer",
      },
      {
        Header: (
          <TableHeaderAlignLeft>
            {translate("tradeItemCrud.variant.platform")}
          </TableHeaderAlignLeft>
        ),
        accessor: "options.75",
        className: "cursor-pointer",
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
                  aria-label="Edit variant"
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
                  setVariantIndexToDelete(index);
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>

              {!original.options["75"] && (
                <IconButton
                  color="primary"
                  size="large"
                  aria-label="Edit variant"
                  sx={{
                    padding: 0.5,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAdd && onAdd(index);
                  }}
                >
                  <AddIcon fontSize="medium" />
                </IconButton>
              )}
            </TableActionsWrapper>
          );
        },
      },
    ],
    [translate, onEdit, removeTradeItemValue]
  );

  if (variantDefinitions && variantDefinitions.length === 0) {
    return (
      <div>
        <label>{"No Data"}</label>
      </div>
    );
  }

  sortVariants(variantDefinitions);

  return (
    <>
      <Table
        columns={columns}
        data={variantDefinitions}
        getTrProps={(state, rowInfo) => ({
          onClick: () => {
            setSelectedVariantIndex(rowInfo.index);
          },
          style:
            selectedVariantIndex === rowInfo.index
              ? { backgroundColor: BLUELIGHT }
              : {},
        })}
        manual
        sortable={false}
        showFilters={false}
        showPagination={false}
        showPageSizeOptions={false}
        defaultPageSize={0}
      />

      {!isNil(variantIndexToDelete) && (
        <Modal sm>
          <Row>
            <Col col center>
              <H5>{translate("tradeItemCrud.variant.confirmDelete")}</H5>
              <Margin bottom={5} />
            </Col>
          </Row>
          <Row>
            <Col col center>
              {/* Cancel */}
              <Button
                onClick={(e) => {
                  setVariantIndexToDelete(null);
                }}
                light
              >
                {translate("tradeItemCrud.variant.confirmDeleteNo")}
              </Button>

              {/* Remove */}
              <Button
                onClick={() => {
                  removeTradeItemValue &&
                    removeTradeItemValue(
                      "variantDefinitions",
                      variantIndexToDelete
                    );
                  setVariantIndexToDelete(null);
                }}
                danger
                noMargin
              >
                {translate("tradeItemCrud.variant.confirmDeleteYes")}
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default React.memo(Variants);
