import React, { useState } from "react";
import styled from "styled-components";
import map from "lodash/map";
import get from "lodash/get";
import { Button, Zone, Row, Col, H5 } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import ConnectorStatus from "dashboard/ConnectorStatus";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import ToggleZone from "cdm-shared/component/ToggleZone";

const CountryRow = styled(Row)`
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f5f5f5;
`;

const ViewConnectorsList = styled(Button)`
  border-radius: 3rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin: 0 auto;
  transform: translateX(-50%) translateY(50%);
`;

const ZoneStyled = styled(Zone)`
  padding: 2rem;
`;


const ConnectorsDetail = ({
  theme,
  // functions
  translate
}) => {
  const [{ connectors }] = useStateValue();

  const [show, setShow] = useState(false);

  return (
    <ZoneStyled noPadding noShadow>
      <ToggleZone height="150px" show={show}>
        {map(connectors, (c, i) => (
          <CountryRow key={`connector-list-country-${i}`}>
            <Col col={12}>
              <H5 block spaced>
                {get(c, "key")}
              </H5>
            </Col>

            {map(get(c, "values"), (connector, connectorIndex) => (
              <Col
                key={`connector-list-country-values-${i}-${connectorIndex}`}
                col={3}
              >
                <ConnectorStatus
                  key={`connector-value-${i}-${connectorIndex}`}
                  connector={connector}
                  theme={theme}
                />
              </Col>
            ))}
          </CountryRow>
        ))}
      </ToggleZone>

      {!show && (
        <ViewConnectorsList onClick={e => setShow(true)} secondary shadow>
          + {translate("dashboard.manufacturer.viewConnectorsList")}
        </ViewConnectorsList>
      )}
    </ZoneStyled>
  );
};

export default React.memo(
  withTheme(withLocalization(ConnectorsDetail))
);
