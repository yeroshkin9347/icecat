import React, { useMemo } from "react";
import styled from "styled-components";
import get from "lodash/get";
import indexOf from "lodash/indexOf";
import { Icon, Text } from "cdm-ui-components";
import { ic_fiber_manual_record } from "react-icons-kit/md/ic_fiber_manual_record";
import { parseDate } from "cdm-shared/utils/date";
import { CONNECTOR_STATUSES } from "./constants";

const CONNECTOR_PENDING_STATUS = [
  CONNECTOR_STATUSES.INACTIVE,
  CONNECTOR_STATUSES.DEVELOPMENT,
  CONNECTOR_STATUSES.PROJECT
];

const getConnectorStatusColor = (status, colors) => {
  switch (status) {
    case false:
      return colors.yellow;
    case true:
      return colors.green;
    default:
      return colors.red;
  }
};

const isConnectorPending = connector =>
  indexOf(CONNECTOR_PENDING_STATUS, get(connector, "status")) !== -1;

const ConnectorStatusIcon = styled(Icon)`
  color: ${props =>
    `rgb(${getConnectorStatusColor(props.status, props.theme.color)})`};
  margin-right: 0.5rem;
`;

const ConnectorStatusRaw = ({ status, theme, size }) => (
  <ConnectorStatusIcon
    status={status}
    theme={theme}
    size={size}
    icon={ic_fiber_manual_record}
  />
);

const ConnectorStatus = ({ connector, theme }) => {
  // memoized values as there are a lot of connectors statuses displayed in the page
  const isPending = useMemo(() => isConnectorPending(connector), [connector]);
  const isProduction = useMemo(
    () => get(connector, "status") === CONNECTOR_STATUSES.PRODUCTION,
    [connector]
  );

  return (
    <>
      <ConnectorStatusRaw
        status={get(connector, "subscribed")}
        theme={theme}
        size={14}
      />

      <Text
        italic={!isProduction}
        bold={isProduction}
        small
        inline
        gray={!isProduction}
      >
        {get(connector, "connectorName")}
        &nbsp;&nbsp;
        {isPending &&
          get(connector, "releaseDate") &&
          parseDate(get(connector, "releaseDate"))}
      </Text>
    </>
  );
};

export default React.memo(ConnectorStatus);

export { ConnectorStatusRaw };
