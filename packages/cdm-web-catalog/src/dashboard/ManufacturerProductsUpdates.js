import React, { useState, useEffect } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Row, Col, Text, H3, Zone } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { PrimaryLink } from "cdm-shared/component/Link";
import {
  getYesterdayDateTime,
  getLastWeekDateTime,
  getLastMonthDateTime
} from "cdm-shared/utils/date";
import { fullSearch } from "cdm-shared/services/product";
import { defaultFilters } from "catalog/models";
import { prettyNumber } from "common/utils/formatter";

const yesterday = getYesterdayDateTime();
const lastWeek = getLastWeekDateTime();
const lastMonth = getLastMonthDateTime();
const filters = { ...defaultFilters, scope: ["Toys"] };

const ItemZone = styled(Zone)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 30px 0px;
`;

const Title = styled(H3)`
  margin-bottom: 1rem;
`;

const SearchLink = styled(PrimaryLink)`
  margin-top: 0.5rem;
  display: block;
  text-align: center;
`;

const ManufacturerProductsUpdates = ({
  // functions
  translate,
  currentLocaleCode
}) => {
  const [yesterdayCounter, setYesterdayCounter] = useState(0);
  const [lastWeekCounter, setLastWeekCounter] = useState(0);
  const [lastMonthCounter, setLastMonthCounter] = useState(0);

  useEffect(() => {
    // yesterday
    fullSearch(currentLocaleCode, 1, null, {
      ...filters,
      updatedDateStart: yesterday
    }).then(res => setYesterdayCounter(get(res, "data.total") || 0));

    // last week
    fullSearch(currentLocaleCode, 1, null, {
      ...filters,
      updatedDateStart: lastWeek
    }).then(res => setLastWeekCounter(get(res, "data.total") || 0));

    // last month
    fullSearch(currentLocaleCode, 1, null, {
      ...filters,
      updatedDateStart: lastMonth
    }).then(res => setLastMonthCounter(get(res, "data.total") || 0));
  }, [currentLocaleCode]);

  return (
    <>
      <Row>
        {/* Yesterday */}
        <Col col={4}>
          <ItemZone>
            <Title block center>
              {prettyNumber(yesterdayCounter, currentLocaleCode)}
            </Title>

            <Text block center light lightgray small>
              {translate("dashboard.manufacturer.productsUpdated")}
            </Text>

            <SearchLink
              to={`/catalog?scopes[0]=Toys&updatedDateStart=${yesterday}`}
            >
              {translate("dashboard.manufacturer.yesterday")}
            </SearchLink>
          </ItemZone>
        </Col>

        {/* Last week */}
        <Col col={4}>
          <ItemZone>
            <Title block center>
              {prettyNumber(lastWeekCounter, currentLocaleCode)}
            </Title>

            <Text block center light lightgray small>
              {translate("dashboard.manufacturer.productsUpdated")}
            </Text>

            <SearchLink
              to={`/catalog?scopes[0]=Toys&updatedDateStart=${lastWeek}`}
            >
              {translate("dashboard.manufacturer.lastWeek")}
            </SearchLink>
          </ItemZone>
        </Col>

        {/* Last month */}
        <Col col={4}>
          <ItemZone>
            <Title block center>
              {prettyNumber(lastMonthCounter, currentLocaleCode)}
            </Title>

            <Text block center light lightgray small>
              {translate("dashboard.manufacturer.productsUpdated")}
            </Text>

            <SearchLink
              to={`/catalog?scopes[0]=Toys&updatedDateStart=${lastMonth}`}
            >
              {translate("dashboard.manufacturer.lastMonth")}
            </SearchLink>
          </ItemZone>
        </Col>
      </Row>
    </>
  );
};

export default withLocalization(ManufacturerProductsUpdates);
