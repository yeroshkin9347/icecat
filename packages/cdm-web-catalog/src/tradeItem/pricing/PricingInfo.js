import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { Label, P, Row, Col, Tag } from "cdm-ui-components";
import { formatDate, formatPrice } from "cdm-shared/utils/format";

const renderTargetMarkets = (o, targetMarkets) => {
  if (isEmpty(get(o, "targetMarketIds", null))) return <React.Fragment />;
  return map(get(o, "targetMarketIds", []), i => (
    <Tag key={`tag-tm-${i}`} info>
      {get(targetMarkets, i)}
    </Tag>
  ));
};

const PricingInfo = ({ price, targetMarkets, translate }) => (
  <>
    {!isEmpty(get(price, "targetMarketIds", null)) && (
      <>
        {renderTargetMarkets(price, targetMarkets)}
        <br />
        <br />
      </>
    )}
    <Row>
      <Col col>
        <Label>{translate("tradeitem.pricing.catalogPriceWithoutTax")}</Label>
        <P>
          {formatPrice(
            get(price, "catalog_price_without_tax", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>{translate("tradeitem.pricing.suggestedPrice")}</Label>
        <P>
          {formatPrice(
            get(price, "suggested_price", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>{translate("tradeitem.pricing.negociatedPrice")}</Label>
        <P>
          {formatPrice(
            get(price, "negociated_price", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>{translate("tradeitem.pricing.currencyCode")}</Label>
        <P>{get(price, "currency_code.value", null) || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.startDate")}</Label>
        <P>{formatDate(get(price, "start_date"))}</P>
        <br />
        <Label>{translate("tradeitem.pricing.endDate")}</Label>
        <P>{formatDate(get(price, "end_date"))}</P>
        <br />
      </Col>
      <Col col>
        <Label>{translate("tradeitem.pricing.collections")}</Label>
        <P>{Object.values(get(price, "collections", {})).join(", ") || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.taxTypeCode")}</Label>
        <P>{get(price, "tax_type_code.value", null) || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.greenTaxAmount")}</Label>
        <P>
          {formatPrice(
            get(price, "green_tax_amount", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>
          {translate("tradeitem.pricing.green_tax_organism_collector")}
        </Label>
        <P>{get(price, "green_tax_organism_collector", null) || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.weeeTaxAmount")}</Label>
        <P>
          {formatPrice(
            get(price, "weee_tax_amount", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>
          {translate("tradeitem.pricing.weee_tax_organism_collector")}
        </Label>
        <P>{get(price, "weee_tax_organism_collector", null) || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.sorecop_tax_amount")}</Label>
        <P>
          {formatPrice(
            get(price, "sorecop_tax_amount", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
      </Col>
      <Col col>
        <Label>{translate("tradeitem.pricing.rep_code")}</Label>
        <P>{get(price, "rep_code.value", null) || '-'}</P>
        <br />
        <Label>{translate("tradeitem.pricing.rep_tax_amount")}</Label>
        <P>
          {formatPrice(
            get(price, "rep_tax_amount", null) || '-',
            get(price, "currency_code.key", null)
          )}
        </P>
        <br />
        <Label>
          {translate("tradeitem.pricing.rep_tax_organism_collector")}
        </Label>
        <P>{get(price, "rep_tax_organism_collector.value", null) || '-'}</P>
        <br />
        <Label>
          {translate("tradeitem.pricing.rep_paid_by_retailer")}
        </Label>
        <P>{get(price, "rep_paid_by_retailer.value", null) || '-'}</P>
        <br />
        <Label>
          {translate("tradeitem.pricing.discountable_rate")}
        </Label>
        <P>{get(price, "discountable_rate.value", null) || '-'}</P>
        <br />
        <Label>
          {translate("tradeitem.pricing.invoiced_from_france")}
        </Label>
        <P>{get(price, "invoiced_from_france.value", null) || '-'}</P>
        <br />
        <Label>
          {translate("tradeitem.pricing.drop_shipped")}
        </Label>
        <P>{get(price, "drop_shipped.value", null) || '-'}</P>
        <br />
      </Col>
    </Row>
  </>
);

export default (props) => {

   console.log('🚀 Line: 157 👈 🆚 👉 ==== n-console: props',props)

  return <PricingInfo {...props}/>
};
