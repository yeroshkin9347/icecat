import React, { useState, useCallback, useMemo } from "react";
import size from "lodash/size";
import get from "lodash/get";
import map from "lodash/map";
import { Row, Col, P, Button, Margin, Text } from "cdm-ui-components";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import { createEnrichmentRequest } from "cdm-shared/services/enrichmentRequest";

function mapTradeItems(tradeItems) {
  return map(tradeItems, ti => ({
    gtin: get(ti, "gtin"),
    manufacturerReference: get(ti, "tradeItemManufacturerCode")
  }));
}

const CreateRequest = ({
  gtins,
  tradeItems,
  // functions
  translate,
  onCreated,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const count = useMemo(() => size(gtins) + size(tradeItems), [
    gtins,
    tradeItems
  ]);

  const memoizedCreateRequest = useCallback(() => {
    setLoading(true);
    setError(null);
    createEnrichmentRequest(gtins, mapTradeItems(tradeItems))
      .then(res => {
        onCreated && onCreated(get(res, "data"));
        setLoading(false);
      })
      .catch(res => {
        setLoading(false);
        setError(translate("export.requests.error"));
      });
  }, [gtins, tradeItems, onCreated, translate]);

  return (
    <>
      <Row>
        <Col col={12} center>
          {!loading && (
            <P lead>
              {translate(`export.requests.createTitle`, {
                numberOfGtins: count
              })}
            </P>
          )}

          {!loading && error && <Text danger>{error}</Text>}

          {loading && <PrimaryLoader />}
        </Col>
      </Row>

      {!loading && (
        <>
          <Margin vertical={5} />

          <Row>
            <Col col={12} right>
              {/* Cancel */}
              <Button onClick={e => onCancel && onCancel()} light small>
                {translate(`export.requests.cancel`)}
              </Button>

              {/* Create */}
              <Button
                onClick={e => memoizedCreateRequest()}
                primary
                small
                noMargin
                shadow
              >
                {translate(`export.requests.create`)}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default CreateRequest;
