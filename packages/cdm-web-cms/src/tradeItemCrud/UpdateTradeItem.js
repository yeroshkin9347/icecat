import React, { useEffect } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import UpdateTradeItem from "cdm-shared/component/tradeItemCrud/UpdateTradeItem";

function EmbeddedUpdateTradeItem(props) {
  useEffect(() => {
    localStorage.setItem("isAdmin", 1);
  }, []);
  return <UpdateTradeItem {...props} isAdmin />;
}

export default withLocalization(EmbeddedUpdateTradeItem);
