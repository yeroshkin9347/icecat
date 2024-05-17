import React from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { Margin,Row, Col} from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ContainerWrap,
  LabelWrap,
} from "./styles";


const ModalForm = ({ translate}) => {
  return (
    <div>
      <ContainerWrap>
        <Row>
          <Col col={12}>
            <DivWrap>
              <LabelWrap>{translate("retailer.add_edit.name")}</LabelWrap>
              <Margin left={4} />
              <InputWrap type="text" value={null} />
            </DivWrap>
            <DivWrap>
              <LabelWrap>{translate("retailer.add_edit.description")}</LabelWrap>
              <Margin left={4} />
              <InputWrap type="text" value={null} />
            </DivWrap>
            <DivWrap>
              <LabelWrap>{translate("retailer.add_edit.description")}</LabelWrap>
              <Margin left={4} />
              <InputWrap type="text" value={null} />
            </DivWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </div>
  );
};

export default withLocalization(ModalForm);
