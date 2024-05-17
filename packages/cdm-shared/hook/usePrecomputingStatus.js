import { useState, useEffect } from "react";
import { getTradeItemPrecomputingStatus } from "cdm-shared/services/precomputing";
import get from "lodash/get";

export default function usePrecomputingStatus(tradeItemId) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getTradeItemPrecomputingStatus(tradeItemId).then(res =>
      setStatus(get(res, "data.tradeItemPreComputingStatus[0].status"))
    );
  }, []);

  return status;
}
