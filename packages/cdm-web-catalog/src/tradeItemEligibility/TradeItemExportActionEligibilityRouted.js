import React from "react";
import { withRouter } from "react-router-dom";
import TradeItemExportActionEligibility from "./TradeItemExportActionEligibility";
import { withLocalization } from "common/redux/hoc/withLocalization";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { get } from "lodash";
import { SinglePageLayout } from "styled-components/layout";

function TradeItemExportActionEligibilityRouted({ match, translate }) {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const lang = get(params, "lang");

  return (
    <SinglePageLayout
      title={translate("tradeItemEligibility.list.title")}
      subtitle={translate("tradeItemEligibility.list.subtitle")}
      breadcrumbs={[
        { title: translate("header.nav.home"), route: "/" },
        { title: translate("tradeItemEligibility.list.title"), route: "/network-status" },
        { title: "Detail" }
      ]}
    >
      <TradeItemExportActionEligibility
        lang={lang}
        tradeItemEligibilityId={match.params.id}
      />
    </SinglePageLayout>
  );
}

export default withRouter(
  withLocalization(
    TradeItemExportActionEligibilityRouted
  )
);
