import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import get from "lodash/get";
import { Zone, Row, Col } from "cdm-ui-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import ConnectorStatus from "dashboard/ConnectorStatus";

const ConnectorsZone = styled(Zone)`
  padding: 0.5rem 0.5rem;
  min-width: 500px;
  width: 500px;
  text-align: left;
`;

const Connectors = React.memo(({ connectors, theme }) => {
  return (
    <ConnectorsZone transparent noShadow>
      <Row>
        {map(get(connectors, "values"), (c, i) => (
          <Col key={`connector-${i}`} col={6}>
            <ConnectorStatus connector={c} theme={theme} />
          </Col>
        ))}
      </Row>
    </ConnectorsZone>
  );
});

export default withTheme(Connectors);
