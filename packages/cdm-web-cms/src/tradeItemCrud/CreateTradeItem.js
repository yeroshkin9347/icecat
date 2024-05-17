import React, { useEffect } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import UpdateTradeItem from "cdm-shared/component/tradeItemCrud/UpdateTradeItem";

function EmbeddedCreateTradeItem(props) {
  useEffect(() => {
    localStorage.setItem("isAdmin", 1);
  }, []);
  return <UpdateTradeItem {...props} isAdmin />;
}

// withLocalProviders used to work on a single context tree instance
export default withLocalization(EmbeddedCreateTradeItem);
