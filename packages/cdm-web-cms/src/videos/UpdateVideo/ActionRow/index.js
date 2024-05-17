import React from "react";
import { Button, Col, Row } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";

const ActionsRow = ({
  translate,
  // functions
  onUpdate,
  onCancel,
}) => (
  <Row
    right
    style={{
      marginTop: "20px",
    }}
  >
    <Col col right>
      <Button
        onClick={(e) => {
          onCancel && onCancel();
        }}
        small
        light
      >
        {translate("video.edit.cancel")}
      </Button>

      <Button
        onClick={(e) => {
          onUpdate && onUpdate();
        }}
        small
        primary
        style={{
          marginRight: "0",
        }}
      >
        {translate("video.edit.update")}
      </Button>
    </Col>
  </Row>
);

export default withLocalization(ActionsRow);
