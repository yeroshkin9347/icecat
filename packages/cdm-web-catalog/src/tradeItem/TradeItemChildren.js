import React from "react";
import map from "lodash/map";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Padding, P, Row, Col, H3, H4 } from "cdm-ui-components";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import Link from "cdm-shared/component/Link";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";

const TradeItemChildren = ({
  tradeItem,
  // functions
  translate,
  currentLanguageCode
}) => {
  if (!tradeItem)
    return <React.Fragment />;

  const tradeItemChildren = get(tradeItem, "children", []);
  const tradeItemBoxContent = get(tradeItem, "logistic.values.box_content", "");

  if (isEmpty(tradeItemChildren) && !tradeItemBoxContent)
    return <React.Fragment />;

  return (
    <ZoneStyled
      style={{
        minWidth: "50%",
        minHeight: "300px",
        maxWidth: "1500px",
        margin: "0 auto"
      }}
      responsive
      borderRadius
    >
      <H3>{translate("tradeitem.children.title")}</H3>

      {!isEmpty(tradeItemChildren) && (
        <Padding bottom={3}>
          <Row>
            {map(tradeItemChildren, (child, k) => (
              <Col key={`trade-item-child-${k}`} col={3}>
                <Padding bottom={3}>
                  <P>
                    <Link target="blank" to={`/product/${currentLanguageCode}/${get(child, "values.tradeItemId")}`} >
                      {get(child, "values.quantity")} x{" "}
                      {get(child, "values.ean_child")} /{" "}
                      {get(child, "values.manufacturer_reference_child")}
                    </Link>
                  </P>
                </Padding>
              </Col>
            ))}
          </Row>
        </Padding>
      )}
      {tradeItemBoxContent && (
        <div>
          <H4>{translate('tradeitem.children.box_content')}</H4>

          <P lead>{tradeItemBoxContent}</P>
        </div>
      )}
    </ZoneStyled>
  );
};

export default onlyUpdateForKeys(["tradeItem"])(TradeItemChildren);
