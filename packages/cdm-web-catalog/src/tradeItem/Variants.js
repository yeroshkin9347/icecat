import React, { useMemo } from "react";
import { H3 } from "cdm-ui-components";
import { useHistory } from "react-router-dom";
import withUser from "cdm-shared/redux/hoc/withUser";
import Table, { TableCellWithTooltip } from "cdm-shared/component/Table";
import { TableHeaderAlignLeft } from "cdm-shared/component/tradeItemCrud/table/styles";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";

const Variants = ({ tradeItem, translate, lang }) => {
  const history = useHistory();
  const variants = tradeItem ? tradeItem.variantDefinitions : [];
  const variantOptions = variants
    ? variants.map((v) => ({ ...v.options, id: v.tradeItemId }))
    : [];

  const columns = useMemo(
    () => [
      {
        Header: <TableHeaderAlignLeft>{translate("tradeitem.variants.edition")}</TableHeaderAlignLeft>,
        accessor: "8410",
        className: "cursor-pointer",
        Cell: TableCellWithTooltip,
      },
      {
        Header: <TableHeaderAlignLeft>{translate("tradeitem.variants.platform")}</TableHeaderAlignLeft>,
        accessor: "75",
        className: "cursor-pointer",
        Cell: TableCellWithTooltip,
      },
    ],
    [translate]
  );

  return (
    <ZoneStyled
      style={{
        minWidth: "50%",
        minHeight: "300px",
        maxWidth: "1500px",
        margin: "0 auto",
      }}
      responsive
      borderRadius
    >
      <H3>{translate("tradeitem.variants.title")}</H3>

      <Table
        columns={columns}
        data={variantOptions}
        getTrProps={(state, rowInfo) => ({
          onClick: () => {
            const variantTradeItemId = variants[rowInfo.index].tradeItemId;
            const tradeItemId = tradeItem ? tradeItem.tradeItemId : "";
            if (variantTradeItemId && tradeItemId) {
              history.push(
                `/product/${lang}/${variantTradeItemId}?master=${tradeItemId}`
              );
            }
          },
        })}
        manual
        sortable={false}
        showFilters={false}
        showPagination={false}
        showPageSizeOptions={false}
        defaultPageSize={0}
      />
    </ZoneStyled>
  );
};

export default withUser(Variants);
