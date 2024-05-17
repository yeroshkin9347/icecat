import React from "react";
import map from "lodash/map";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Tag, Tooltip, Text } from "cdm-ui-components";

function TradeItemEligibilityStatus({
  tradeItemEligibility,
  translate,
  onClick,
  noTooltip,
  ...otherProps
}) {
  if (tradeItemEligibility.tradeItemEligibilityStatus !== "Exportable") {
    const target = (
      <Tag
        onClick={e => {
          e.preventDefault();
          onClick && onClick(e);
        }}
        noMargin
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
        {...otherProps}
      >
        {translate(
          `tradeItemEligibility.common.${tradeItemEligibility.tradeItemEligibilityStatus}`
        )}
      </Tag>
    );

    if (isEmpty(tradeItemEligibility.rejectionStatuses) || noTooltip)
      return target;
    else
      return (
        <Tooltip
          interactive
          placement="right"
          html={map(get(tradeItemEligibility, "rejectionStatuses"), (o, k) => (
            <Text block key={`rejection-status-detail-from-list-${k}`}>
              {translate(`tradeItemEligibility.common.${o}`)}
            </Text>
          ))}
        >
          {target}
        </Tooltip>
      );
  }

  return (
    <Tag
      onClick={e => {
        e.preventDefault();
        onClick && onClick(e);
      }}
      noMargin
      success
      {...otherProps}
    >
      {translate(
        `tradeItemEligibility.common.${tradeItemEligibility.tradeItemEligibilityStatus}`
      )}
    </Tag>
  );
}

export default React.memo(TradeItemEligibilityStatus);
