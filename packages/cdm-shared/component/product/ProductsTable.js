import React, {useMemo} from "react";
import {Input} from "cdm-ui-components";
import Table from "../Table";
import StyledLink from "../Link";
import PrecomputingStatus from "../precomputing/PrecomputingStatus";
import FlagIcon from "../lang/FlagIcon";
import { getUpdateProductLinkWithMasterTradeItemId } from "../calendars/utils";
import { withLocalization } from "common/redux/hoc/withLocalization";

function ProductsTable({
  translate,
  products,
  loading,
  visibleColumns,
  actions,
  rowSelection,
  showCheckbox,
  selectedIds,
  removeButton = 'Remove',
  onSelectRow,
  onDeselectRow,
  onRemoveRow,
  ...tableProps
}) {
  const onClickRow = (row) => {
    const selected = selectedIds?.includes(row.tradeItemId);
    if (selected) {
      onDeselectRow && onDeselectRow(row);
    } else {
      onSelectRow && onSelectRow(row);
    }
  };

  const columns = useMemo(() => {
    let hasHeaderGroup = true;
    let cols = [
      {
        id: 'information',
        Header: translate("product.table.information"),
        columns: [
          {
            id: 'tradeItemId',
            Header: translate("product.table.id"),
            accessor: "tradeItemId",
          },
          {
            id: 'manufacturerName',
            Header: translate("product.table.manufacturer"),
            accessor: "manufacturerName",
          },
          {
            id: 'gtin',
            Header: translate("product.table.gtin"),
            accessor: "identities[0].gtin.value",
          },
          {
            id: 'tradeItemManufacturerCode',
            Header: translate("product.table.tradeItemManufacturerCode"),
            accessor: "identities[0].tradeItemManufacturerCode",
          },
          {
            id: 'title',
            Header: translate("product.table.title"),
            accessor: "title",
          },
          {
            id: 'category',
            Header: translate("product.table.category"),
            accessor: "tradeItemCategory.name",
          },
          {
            id: 'languageAvailable',
            Header: translate("product.table.languagesAvailable"),
            accessor: (d) => (
              <div className="d-flex flex-wrap" style={{ gap: '2px' }}>
                {(d.languagesAvailable || []).map((code) => (
                  <FlagIcon key={code} code={code} title={code} />
                ))}
              </div>
            ),
          },
        ],
      },
      {
        id: 'precomputing',
        Header: translate("product.table.precomputing"),
        columns: [
          {
            id: "preComputingStatus",
            Header: translate("product.table.precomputingStatus"),
            accessor: (d) => (
              <PrecomputingStatus status={d.precomputingStatus} />
            ),
          },
        ],
      },
    ];
    if (visibleColumns) {
      cols.forEach((col) => {
        col.columns = col.columns.filter((item) => visibleColumns.includes(item.id));
      });
      cols = cols.filter((col) => col.columns.length > 0);
      hasHeaderGroup = cols.length > 1;
      if (cols.length === 1) {
        cols = cols[0].columns;
      }
    }

    if (showCheckbox) {
      let checkboxCol = {
        id: 'checkbox',
        Header: ' ',
        accessor: (d) => (
          <Input
            type="checkbox"
            checked={selectedIds?.includes(d.tradeItemId)}
          />
        ),
      };
      if (hasHeaderGroup) {
        checkboxCol = {
          Header: ' ',
          columns: [checkboxCol],
        };
      }
      cols.unshift(checkboxCol);
    }

    if (actions?.length) {
      let actionsCol = {
        id: 'actions',
        Header: translate("product.table.actions"),
        accessor: (d) => {
          const productUpdateLink = getUpdateProductLinkWithMasterTradeItemId(d.tradeItemId, d.masterTradeItemId, false);
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {actions.includes('edit') && (
                <StyledLink to={productUpdateLink}>
                  Edit
                </StyledLink>
              )}
              {actions.includes('remove') && (
                <span
                  className="cursor-pointer ml-2"
                  onClick={() => onRemoveRow && onRemoveRow(d)}
                >
                  {removeButton}
                </span>
              )}
            </div>
          )
        },
      };
      if (hasHeaderGroup) {
        actionsCol.Header = ' ';
        actionsCol = {
          Header: translate("product.table.actions"),
          columns: [actionsCol],
        };
      }
      cols.push(actionsCol);
    }

    return cols;
  }, [actions, onRemoveRow, selectedIds, showCheckbox, translate, visibleColumns]);

  return (
    <Table
      columns={columns}
      data={products}
      loading={loading}
      noDataText="No products"
      pageSize={products.length || 5}
      showPagination={false}
      getTrProps={(_, rowInfo) => {
        return {
          onClick() {
            if (rowSelection && onClickRow) {
              onClickRow(rowInfo.original);
            }
          }
        }
      }}
      style={{ width: '100%' }}
      {...tableProps}
    />
  );
}

export default withLocalization(ProductsTable);
