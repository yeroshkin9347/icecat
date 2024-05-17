import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import take from "lodash/take";
import keys from "lodash/keys";
import { Zone, H3, Row, Col, P, Padding, Button } from "cdm-ui-components";
import { getTradeItemEligibilityForTradeItemIdGroupedByRetailer } from "cdm-shared/services/tradeItemEligibilityNetwork";
import EligibilityStatusLink from "./EligibilityStatusLink";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import { PrimaryLink } from "cdm-shared/component/Link";

const DEFAULT_NB_TO_DISPLAY = 6;

const StyledCol = styled(Col)`
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

function Eligibility({
  tradeItemId,
  // functions
  translate
}) {
  // eligibilities by export action
  const [
    tradeItemEligibilitiesGrouped,
    setTradeItemEligibilitiesGrouped
  ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTradeItemEligibilityForTradeItemIdGroupedByRetailer(tradeItemId)
      .then(res => {
        const values = res.data;
        setTradeItemEligibilitiesGrouped(values);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  }, [tradeItemId]);

  const tradeItemEligibilitiesElements = useMemo(() => {
    const itemsKeys = showAll
      ? keys(tradeItemEligibilitiesGrouped)
      : take(keys(tradeItemEligibilitiesGrouped), DEFAULT_NB_TO_DISPLAY);
    return map(itemsKeys, key => (
      <StyledCol col={6} key={`trade-item-eligibility-${key}`}>
        <Row>
          <Col col={8}>
            <PrimaryLink
              to={`/network-status?tradeItemId=${get(
                tradeItemEligibilitiesGrouped,
                `${key}.0.tradeItem.id`
              )}&retailerId=${get(
                tradeItemEligibilitiesGrouped,
                `${key}.0.exportAction.retailer.id`
              )}`}
            >
              <P lead>{key}</P>
            </PrimaryLink>
          </Col>
          <Col col={4}>
            <Padding top={1} />
            {map(
              tradeItemEligibilitiesGrouped[key],
              (tradeItemEligibility, idx) => (
                <EligibilityStatusLink
                  key={`trade-item-eligibility-status-${key}-${idx}`}
                  tradeItemEligibility={tradeItemEligibility}
                />
              )
            )}
          </Col>
        </Row>
      </StyledCol>
    ));
  }, [tradeItemEligibilitiesGrouped, showAll]);

  const leftToDisplay = useMemo(
    () =>
      size(tradeItemEligibilitiesGrouped) -
      size(tradeItemEligibilitiesElements),
    [tradeItemEligibilitiesElements, tradeItemEligibilitiesGrouped]
  );

  return (
    <Zone borderRadius style={{ minHeight: "250px" }}>
      <H3>{translate("tradeitem.eligibility.title")}</H3>

      {isLoading && <PrimaryLoader />}

      <Row>
        {tradeItemEligibilitiesElements}

        {!showAll && leftToDisplay > 0 && (
          <Col col={12} center>
            <Padding top={4} />
            <Button onClick={() => setShowAll(true)} secondary noMargin>
              {translate("tradeitem.hero.viewMore")}
              &nbsp; ({leftToDisplay})
            </Button>
          </Col>
        )}
      </Row>
    </Zone>
  );
}

export default Eligibility;
