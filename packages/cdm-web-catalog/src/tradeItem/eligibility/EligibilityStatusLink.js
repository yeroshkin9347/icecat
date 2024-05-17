import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import get from "lodash/get";
import map from "lodash/map";
import { Tooltip, Text, RoundedButton, Icon } from "cdm-ui-components";
import { ic_visibility } from "react-icons-kit/md/ic_visibility";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withRouter } from "react-router-dom";

const EligibilityStatusElement = styled(RoundedButton)`
  display: inline-block;
  position: relative;
  margin-right: 4px;
`;

function EligibilityStatusLink({
  tradeItemEligibility,
  match,
  // function
  translate
}) {
  const lang = get(match, "params.lang");

  return (
    <Tooltip
      interactive
      placement="top"
      html={
        <>
          {`${translate(
            `tradeItemEligibility.common.${tradeItemEligibility.tradeItemEligibilityStatus}`
          )} - ${get(tradeItemEligibility, "exportAction.name")}`}
          <br />
          <br />
          {map(get(tradeItemEligibility, "rejectionStatuses"), (o, k) => (
            <Text block key={`rejection-status-detail-${k}`}>
              {translate(`tradeItemEligibility.common.${o}`)}
            </Text>
          ))}
        </>
      }
    >
      <Link to={`/network-status-item/${tradeItemEligibility.id}?lang=${lang}`}>
        <EligibilityStatusElement
          small
          success={
            tradeItemEligibility.tradeItemEligibilityStatus === "Exportable"
          }
          warning={
            tradeItemEligibility.tradeItemEligibilityStatus ===
            "ExportableWithWarning"
          }
          danger={
            tradeItemEligibility.tradeItemEligibilityStatus === "NotExportable"
          }
          secondary={
            tradeItemEligibility.tradeItemEligibilityStatus === "Exclusive"
          }
          light={
            tradeItemEligibility.tradeItemEligibilityStatus ===
              "FilteredByEnrichment" ||
            tradeItemEligibility.tradeItemEligibilityStatus ===
              "BlockedByChannelManagement"
          }
        >
          <Icon size={12} icon={ic_visibility} />
        </EligibilityStatusElement>
      </Link>
    </Tooltip>
  );
}

export default React.memo(
  withRouter(withLocalization(EligibilityStatusLink))
);
