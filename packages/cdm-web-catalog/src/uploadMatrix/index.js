import React from "react";
import { P, H4 } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import ImportProducts from "cdm-shared/component/import/ImportProducts";
import { SinglePageLayout } from "styled-components/layout";

function UploadMatrix({ translate }) {
  return (
    <SinglePageLayout
      title={translate("uploadMatrix.title")}
      subtitle={translate("uploadMatrix.subtitle")}
      breadcrumbs={[
        { title: translate("header.nav.home"), route: "/" },
        { title: translate("uploadMatrix.title") }
      ]}
    >
      <H4>{translate("uploadMatrix.subtitle")}</H4>
      <P>{translate("uploadMatrix.hint")}</P>
      <br />
      <br />

      <ImportProducts importsLink={`import-reports/all`} />
    </SinglePageLayout>
  );
}

export default withUser(withLocalization(UploadMatrix));
