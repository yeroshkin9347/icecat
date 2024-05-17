import React from "react";
import usePrecomputingStatus from "../../hook/usePrecomputingStatus";
import PrecomputingStatus from "./PrecomputingStatus";

function TradeItemPrecomputingStatus({ tradeItemId }) {
  const status = usePrecomputingStatus(tradeItemId);

  return status ? <PrecomputingStatus status={status} /> : null;
}

export default React.memo(TradeItemPrecomputingStatus);
