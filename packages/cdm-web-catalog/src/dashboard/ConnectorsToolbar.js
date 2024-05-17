import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import values from "lodash/values";
import size from "lodash/size";
import indexOf from "lodash/indexOf";
import slice from "lodash/slice";
import isArray from "lodash/isArray";
import { Row, Col, StackedButton, Input, Text } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { ConnectorStatusRaw } from "./ConnectorStatus";
import {
  CONNECTOR_STATUSES,
  CONNECTOR_TYPES,
  CONNECTOR_SUBSCRIBED
} from "./constants";
import { useStateValue } from "cdm-shared/hook/useStateValue";

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 1200px) {
    justify-content: space-around;
    
    .types-filter {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`

const FilterButton = styled(StackedButton)`
  padding: 0rem 0.1rem;
  font-weight: 200;
  font-size: 0.8rem;
  line-height: 1;
  height: 2.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

const Checkbox = styled(Input)`
  margin-top: -3px;
  margin-right: 6px;
`;

const isActive = (filters, key, value) =>
  isArray(filters[key])
    ? indexOf(filters[key], value) !== -1
    : filters[key] === value;

const addFilterValue = (filters, key, value) => {
  return [...filters[key], value];
};

const removeFilterValue = (filters, key, value) => {
  const index = indexOf(filters[key], value);
  if (index === -1) return filters[key];
  return [...slice(filters[key], 0, index), ...slice(filters[key], index + 1)];
};

const updateFilters = (filters, key, value) =>
  isActive(filters, key, value) && size(filters[key])
    ? removeFilterValue(filters, key, value)
    : addFilterValue(filters, key, value);

const ConnectorsToolbar = ({
  theme,
  // functions
  translate
}) => {
  // eslint-disable-next-line no-empty-pattern
  const [{ filters }, dispatch] = useStateValue();

  return (
    <Toolbar>
      {/* statuses */}
      <div>
        {map(values(CONNECTOR_STATUSES), (connectorStatus, i) => (
          <FilterButton
            key={`c-status-filter-${connectorStatus}`}
            left={i === 0}
            right={i === size(CONNECTOR_STATUSES) - 1}
            middle={i !== size(CONNECTOR_STATUSES) - 1 && i !== 0}
            light
            small
            active={isActive(filters, "connectorStatus", connectorStatus)}
            onClick={() =>
              dispatch({
                type: "setFilters",
                values: [
                  {
                    key: "connectorStatus",
                    value: updateFilters(
                      filters,
                      "connectorStatus",
                      connectorStatus
                    )
                  }
                ]
              })
            }
          >
            <Checkbox
              type="checkbox"
              checked={isActive(filters, "connectorStatus", connectorStatus)}
            />

            <Text
              inline
              bold={connectorStatus === CONNECTOR_STATUSES.PRODUCTION}
              gray={connectorStatus === CONNECTOR_STATUSES.DEVELOPMENT}
              italic={connectorStatus === CONNECTOR_STATUSES.DEVELOPMENT}
            >
              {translate(`dashboard.connectorStatus.${connectorStatus}`)}
            </Text>
          </FilterButton>
        ))}
      </div>

      {/* subscribed */}
      <div>
        {map(values(CONNECTOR_SUBSCRIBED), (connectorSubscribed, i) => (
          <FilterButton
            key={`c-subscribed-filter-${connectorSubscribed}`}
            left={i === 0}
            right={i === size(CONNECTOR_SUBSCRIBED) - 1}
            middle={i !== size(CONNECTOR_SUBSCRIBED) - 1 && i !== 0}
            light
            small
            active={isActive(
              filters,
              "connectorSubscribed",
              connectorSubscribed
            )}
            onClick={() =>
              dispatch({
                type: "setFilters",
                values: [
                  {
                    key: "connectorSubscribed",
                    value: connectorSubscribed
                  }
                ]
              })
            }
          >
            {connectorSubscribed !== CONNECTOR_SUBSCRIBED.ALL && (
              <ConnectorStatusRaw
                status={connectorSubscribed === CONNECTOR_SUBSCRIBED.SUBSCRIBED}
                theme={theme}
                size={14}
              />
            )}

            {translate(`dashboard.connectorSubscribed.${connectorSubscribed}`)}
          </FilterButton>
        ))}
      </div>

      {/* types */}
      <div class="types-filter">
        {map(values(CONNECTOR_TYPES), (connectorType, i) => (
          <FilterButton
            key={`c-type-filter-${connectorType}`}
            left={i === 0}
            right={i === size(CONNECTOR_TYPES) - 1}
            middle={i !== size(CONNECTOR_TYPES) - 1 && i !== 0}
            noMargin={i === size(CONNECTOR_TYPES) - 1}
            light
            small
            active={isActive(filters, "connectorType", connectorType)}
            onClick={() =>
              dispatch({
                type: "setFilters",
                values: [
                  {
                    key: "connectorType",
                    value: updateFilters(
                      filters,
                      "connectorType",
                      connectorType
                    )
                  }
                ]
              })
            }
          >
            <Checkbox
              type="checkbox"
              checked={isActive(filters, "connectorType", connectorType)}
            />

            {translate(`dashboard.connectorType.${connectorType}`)}
          </FilterButton>
        ))}
      </div>
    </Toolbar>
  );
};

export default withTheme(withLocalization(ConnectorsToolbar));
