import React, { useEffect } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import UpdateTradeItem from "cdm-shared/component/tradeItemCrud/UpdateTradeItem";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import { withTradeItemManagementAuth } from "cdm-shared/redux/hoc/withAuth";
import { SinglePageLayout } from "styled-components/layout";

function EmbeddedCreateTradeItem(props) {
  useEffect(() => {
    localStorage.setItem("isAdmin", 0);
  }, []);
  return (
    <SinglePageLayout
      title={props.translate("tradeItemCrud.create.title")}
      subtitle={props.translate("tradeItemCrud.create.subtitle")}
      breadcrumbs={[
        { title: props.translate("header.nav.home"), route: "/" },
        { title: props.translate("tradeItemCrud.create.title") }
      ]}
    >
      <UpdateTradeItem
        {...props}
        triggerAnalyticsEvent={triggerAnalyticsEvent}
      />
    </SinglePageLayout>
  );
}

// withLocalProviders used to work on a single context tree instance
export default withTradeItemManagementAuth(
  withLocalization(EmbeddedCreateTradeItem)
);
