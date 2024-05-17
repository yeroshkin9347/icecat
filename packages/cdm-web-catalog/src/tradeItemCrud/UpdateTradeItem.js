import React, { useEffect } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import UpdateTradeItem from "cdm-shared/component/tradeItemCrud/UpdateTradeItem";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import { withTradeItemManagementAuth } from "cdm-shared/redux/hoc/withAuth";
import { SinglePageLayout } from "styled-components/layout";

function EmbeddedUpdateTradeItem(props) {
  useEffect(() => {
    localStorage.setItem("isAdmin", 0);
  }, []);
  return (
    <>
      <SinglePageLayout
        title={props.translate("tradeItemCrud.update.title")}
        subtitle={props.translate("tradeItemCrud.update.subtitle")}
        breadcrumbs={[
          { title: props.translate("header.nav.home"), route: "/" },
          { title: props.translate("tradeItemCrud.update.title") }
        ]}
      >
        <UpdateTradeItem
          {...props}
          triggerAnalyticsEvent={triggerAnalyticsEvent}
        />
      </SinglePageLayout>
    </>
  );
}

export default withTradeItemManagementAuth(
  withLocalization(EmbeddedUpdateTradeItem)
);
