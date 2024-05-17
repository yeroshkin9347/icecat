import React from "react";
import { Button } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";

const CancelButton = ({ translate, onCancel }) => (
  <Button
    style={{ marginTop: "0.4em" }}
    onClick={onCancel}
    small
    primary
    noMargin
  >
    {translate(`tradeItemCrud.update.goToProduct`)}
  </Button>
);

export default withLocalization(CancelButton);
