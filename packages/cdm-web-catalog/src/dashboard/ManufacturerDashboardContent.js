import React, { useEffect } from "react";
import get from "lodash/get";
import reduce from "lodash/reduce";
import uniq from "lodash/uniq";
import keys from "lodash/keys";
import pick from "lodash/pick";
import { Col, Row, Margin } from "cdm-ui-components";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import ManufacturerGauges from "./ManufacturerGauges";
import ConnectorsMap from "./map/ConnectorsMap";
import ConnectorsDetail from "./ConnectorsDetail";
import ConnectorsToolbar from "./ConnectorsToolbar";
import ManufacturerProductsUpdates from "./ManufacturerProductsUpdates";
import {
  getConnectors,
  getOffers,
  getConnections,
} from "cdm-shared/services/subscription";
import { getManufacturerStatistics } from "cdm-shared/services/tradeItemStats";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { defaultFilters } from "catalog/models";
import MilestonesTable from "./MilestonesTable";
import DigitalAssets from "./DigitalAssets";

const getConnectorsByCountry = (currentLocaleCode) => {
  return Promise.all([
    getConnections(currentLocaleCode),
    getConnectors(currentLocaleCode),
  ]).then(([connections, connectors]) => {
    const reducedConnections = reduce(
      get(connections, "data"),
      (result, current) => {
        return { ...result, [get(current, "key")]: get(current, "values") };
      },
      {}
    );
    const reducedConnectors = reduce(
      get(connectors, "data"),
      (result, current) => {
        return { ...result, [get(current, "key")]: get(current, "values") };
      },
      {}
    );
    const isoCountries = uniq(keys(reducedConnectors));

    return reduce(
      isoCountries,
      (result, isoCountry) => {
        const activeConnectors = reduce(
          get(reducedConnections, isoCountry),
          (connectionsResult, currentConnection) => {
            return {
              ...connectionsResult,
              [get(currentConnection, "connectorId")]: {
                connectionStatus: get(currentConnection, "status"),
              },
            };
          },
          {}
        );

        const finalConnectors = reduce(
          get(reducedConnectors, isoCountry),
          (res, currentConnector) => {
            const currentActiveConnector =
              get(activeConnectors, get(currentConnector, "connectorId")) ||
              null;
            return [
              ...res,
              pick(
                {
                  ...currentConnector,
                  ...(currentActiveConnector || {}),
                  subscribed: !!currentActiveConnector,
                },
                [
                  "connectorId",
                  "connectorName",
                  "status",
                  "releaseDate",
                  "discontinuedDate",
                  "type",
                  "subscribed",
                ]
              ),
            ];
          },
          []
        );

        return [
          ...result,
          {
            key: isoCountry,
            values: finalConnectors,
          },
        ];
      },
      []
    );
  });
};

const ManufacturerDashboardContent = ({ currentLocaleCode }) => {
  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();

  // do all of the async calls here
  // initial the application state
  useEffect(() => {
    dispatch({
      type: "setLoadingValues",
      values: [
        { key: "offers", value: true },
        { key: "connectors", value: true },
      ],
    });

    // do the async calls separately (no await) to display data asap
    getManufacturerStatistics(defaultFilters).then((res) =>
      dispatch({ type: "initProductsStatistics", data: get(res, "data", null) })
    );
    getOffers(currentLocaleCode).then((res) =>
      dispatch({ type: "initOffers", data: get(res, "data", null) })
    );
    getConnectorsByCountry(currentLocaleCode).then((connectors) =>
      dispatch({ type: "initConnectors", data: connectors })
    );
  }, [dispatch, currentLocaleCode]);

  return (
    <>
      <Row>
        {/* Gauges */}
        <Col col={8}>
          <div className="background-white rounded h-full flex items-center justify-center">
            <ManufacturerGauges />
          </div>
        </Col>

        <Col col={4}>
          <DigitalAssets />
        </Col>
      </Row>

      <Margin bottom={4} />

      <Row>
        <Col col>
          <ManufacturerProductsUpdates />
        </Col>
      </Row>

      <Margin bottom={5} />

      <Row>
        <Col col>
          <MilestonesTable />
        </Col>
      </Row>

      <Margin bottom={5} />

      <Row>
        {/* Map */}
        <Col col>
          <ConnectorsMap />

          <Margin vertical={4}>
            <ConnectorsToolbar />
          </Margin>
        </Col>
      </Row>

      <Row>
        {/* Connectors details */}
        <Col col>
          <ConnectorsDetail />
        </Col>
      </Row>
    </>
  );
};

export default withLocalization(ManufacturerDashboardContent);
