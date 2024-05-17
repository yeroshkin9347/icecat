import React from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import {Button, Col, Row} from "cdm-ui-components";

const ClearBasketConfirmDialog = ({ translate, onClose }) => {
  return (
    <ModalStyled sm>
      <div>{ translate('video.cart.clearBasketConfirm.message') }</div>
      <Row
        right
        style={{ marginTop: "30px"}}
      >
        <Col col right>
          <Button type="button" small light onClick={() => onClose(false)}>
            {translate("common.cancel")}
          </Button>
          <Button small primary onClick={() => onClose(true)}>
            {translate("video.cart.clearBasketConfirm.clearBasket")}
          </Button>
        </Col>
      </Row>
    </ModalStyled>
  );
}
export default withLocalization(ClearBasketConfirmDialog);
