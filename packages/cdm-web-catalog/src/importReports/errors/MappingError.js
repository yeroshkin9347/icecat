import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import map from "lodash/map";
import { Row, Col } from "cdm-ui-components";

const TinyRow = styled(Row)`
  font-size: 0.8rem;
  border-bottom: 1px solid #888;
`;
const HeaderCol = styled(Col)`
  font-weight: bold;
`;

const inc = nb => parseInt(nb, 10) + 1;

const MappingError = ({ mappingError, translate }) => {
  return (
    <>
      <TinyRow>
        <HeaderCol col={1}>
          {translate("importReports.errors.property")}
        </HeaderCol>
        <HeaderCol col={1}>
          {translate("importReports.errors.propertyCode")}
        </HeaderCol>
        <HeaderCol col={3}>{translate("importReports.errors.value")}</HeaderCol>
        <HeaderCol col={3}>
          {translate("importReports.errors.reason")}
        </HeaderCol>
        <HeaderCol col={3}>
          {translate("importReports.errors.advice")}
        </HeaderCol>
        <HeaderCol col={1}>
          {translate("importReports.errors.sheetIndex")};
          {translate("importReports.errors.lineNumber")}
        </HeaderCol>
      </TinyRow>

      {map(get(mappingError, "values"), (v, i) => (
        <TinyRow key={`mapping-error-${get(v, "id")}-${i}}`}>
          <Col col={1}>
            {translate(
              `tradeItemProperties.properties.${get(v, "propertyCode")}`
            )}
          </Col>
          <Col col={1} style={{ paddingRight: 0 }} className="truncate">{get(v, "propertyCode")}</Col>
          <Col col={3}>{get(v, "propertyValue")}</Col>
          <Col col={3}>{get(v, "reason")}</Col>
          <Col col={3}>{get(v, "advice")}</Col>
          <Col col={1}>
            {inc(get(v, "sheetIndex"))};{inc(get(v, "lineNumber"))}
          </Col>
        </TinyRow>
      ))}
    </>
  );
};

export default MappingError;
