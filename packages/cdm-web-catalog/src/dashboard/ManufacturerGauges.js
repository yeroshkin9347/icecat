import React, { useMemo } from "react";
import reduce from "lodash/reduce";
import get from "lodash/get";
import size from "lodash/size";
import { GaugeCounter, Text, Row, Col } from "cdm-ui-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { withLocalization } from "common/redux/hoc/withLocalization";
import GaugeLabel from "./GaugeLabel";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import filter from "lodash/filter";

const ManufacturerGauges = ({
  theme,
  // functions
  translate
}) => {
  const [{ productsStatistics, initialConnectors }] = useStateValue();

  // memoized values to make rendering more performant
  const totalOfActiveConnectors = useMemo(
    () =>
      size(
        filter(
          reduce(
            initialConnectors,
            (result, current) => {
              return result.concat(get(current, "values"));
            },
            []
          ),
          { subscribed: true }
        )
      ),
    [initialConnectors]
  );
  const totalOfConnectors = useMemo(
    () =>
      reduce(
        initialConnectors,
        (total, countriedConnectors) =>
          total + size(get(countriedConnectors, "values")),
        0
      ),
    [initialConnectors]
  );
  const productsPercentage = useMemo(
    () =>
      (100 * (get(productsStatistics, "numberOfActiveTradeItems") || 0)) /
      (get(productsStatistics, "numberOfTotalTradeItems") || 1),
    [productsStatistics]
  );
  const connectorsPercentage = useMemo(
    () => (100 * (totalOfActiveConnectors || 0)) / (totalOfConnectors || 1),
    [totalOfConnectors, totalOfActiveConnectors]
  );
  const productsGaugeColor =
    productsPercentage > 50
      ? theme.color.green
      : productsPercentage > 25
      ? theme.color.primary
      : theme.color.secondary;
  const connectorsGaugeColor =
    connectorsPercentage > 50
      ? theme.color.green
      : connectorsPercentage > 25
      ? theme.color.primary
      : theme.color.secondary;

  return (
    <>
      <Row>
        {/* Active products */}
        <Col col style={{ textAlign: "center" }}>
          <GaugeCounter
            rounded
            style={{ display: "inline-block" }}
            percentage={productsPercentage}
            size={"120"}
            stroke={10}
            color={`rgb(${productsGaugeColor})`}
          >
            <GaugeLabel
              title={translate("dashboard.manufacturer.gaugeProductsLabel")}
              nbMin={get(productsStatistics, "numberOfActiveTradeItems")}
              nbMax={get(productsStatistics, "numberOfTotalTradeItems")}
            />
          </GaugeCounter>

          <br />

          <Text center uppercase>
            {translate("dashboard.manufacturer.gaugeProductsTitle")}
          </Text>
        </Col>

        {/* Active connectors */}
        <Col style={{ textAlign: "center" }} col>
          <GaugeCounter
            rounded
            style={{ display: "inline-block" }}
            percentage={connectorsPercentage}
            size={"120"}
            stroke={10}
            color={`rgb(${connectorsGaugeColor})`}
          >
            <GaugeLabel
              title={translate("dashboard.manufacturer.gaugeConnectorsLabel")}
              nbMin={totalOfActiveConnectors}
              nbMax={totalOfConnectors}
            />
          </GaugeCounter>

          <br />

          <Text center uppercase>
            {translate("dashboard.manufacturer.gaugeConnectorsTitle")}
          </Text>
        </Col>
      </Row>
    </>
  );
};

export default withTheme(withLocalization(ManufacturerGauges));
