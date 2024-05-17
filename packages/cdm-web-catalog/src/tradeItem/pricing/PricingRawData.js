import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import { Table, Thead, Tbody, Th, Td, Tr } from "cdm-shared/component/RawTable";
import { formatDate } from "cdm-shared/utils/format";

const PricingRawData = ({ translate, pricing, inline }) => (
  <Table
    style={{
      margin: "0 auto",
      display: inline ? "inline-block" : "block"
    }}
  >
    <Thead>
      <Tr>
        <Th>{translate("tradeitem.pricing.catalogPriceWithoutTax")}</Th>
        <Th>{translate("tradeitem.pricing.suggestedPrice")}</Th>
        <Th>{translate("tradeitem.pricing.negociatedPrice")}</Th>
        <Th>{translate("tradeitem.pricing.currencyCode")}</Th>
        <Th>{translate("tradeitem.pricing.startDate")}</Th>
        <Th>{translate("tradeitem.pricing.endDate")}</Th>
        <Th>{translate("tradeitem.pricing.taxTypeCode")}</Th>
        <Th>{translate("tradeitem.pricing.greenTaxAmount")}</Th>
        <Th>{translate("tradeitem.pricing.green_tax_organism_collector")}</Th>
        <Th>{translate("tradeitem.pricing.weeeTaxAmount")}</Th>
        <Th>{translate("tradeitem.pricing.retailersCodes")}</Th>
      </Tr>
    </Thead>
    {map(pricing, (price, k) => (
      <Tbody key={`pricing-table-${k}`}>
        <Tr>
          <Td>{get(price, "catalog_price_without_tax")}</Td>
          <Td>{get(price, "suggested_price")}</Td>
          <Td>{get(price, "negociated_price")}</Td>
          <Td>{get(price, "currency_code")}</Td>
          <Td>{formatDate(get(price, "start_date"))}</Td>
          <Td>{formatDate(get(price, "end_date"))}</Td>
          <Td>{get(price, "tax_type_code")}</Td>
          <Td>{get(price, "green_tax_organism_collector")}</Td>
          <Td>{get(price, "green_tax_amount")}</Td>
          <Td>{get(price, "weee_tax_amount")}</Td>
          <Td>{get(price, "retailer_codes", []).join(", ")}</Td>
        </Tr>
      </Tbody>
    ))}
  </Table>
);

export default PricingRawData;
