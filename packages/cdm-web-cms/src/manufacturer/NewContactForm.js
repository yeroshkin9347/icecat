import React, { useState } from "react";
import get from "lodash/get";
import DropDown from "../common/layout/DropDown";
import CustomButton from "../common/layout/CustomButton";
import { Margin, Row, Col } from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ContainerWrap,
  LabelWrap,
  CheckboxWrap,
} from "./styles";
import { BLACKLIGHT } from "cdm-shared/component/color";

function NewContactForm({ users, addContactList }) {
  const [userDetails, setUserDetails] = useState(null);

  const changeDetails = (data) => (key) => {
    const details = {
      ...userDetails,
      [key]: data,
    };
    setUserDetails(details);
  };
  return (
    <ContainerWrap>
      <Row>
        <Col col={12}>
          <DivWrap>
            <LabelWrap>{`Active`}</LabelWrap>
            <Margin left={4} />
            <CheckboxWrap>
              <InputWrap
                hideWidth={true}
                type="checkbox"
                onChange={(e) => changeDetails(e.target.checked)(`active`)}
              />
            </CheckboxWrap>
          </DivWrap>
          <DivWrap>
            <LabelWrap>{`Users`}</LabelWrap>
            <Margin left={4} />
            <DropDown
              className={"select-styling-full"}
              isSearchable={true}
              options={users}
              onChange={(e) => changeDetails(e.id)(`userId`)}
              getOptionLabel={(o) => get(o, "name")}
              getOptionValue={(o) => get(o, "id")}
            />
          </DivWrap>
          <DivWrap>
            <LabelWrap>{`Description`}</LabelWrap>
            <Margin left={4} />
            <InputWrap
              type="text"
              onChange={(e) => changeDetails(e.target.value)(`description`)}
            />
          </DivWrap>
          <DivWrap justifyContent={`flex-end`}>
            <CustomButton
              loader={false}
              onClick={() => {}}
              backgroundColor={BLACKLIGHT}
              padding={`4px 8px`}
              title={`Cancel`}
            />
            <Margin left={2} />
            <CustomButton
              disabled={!!!userDetails}
              loader={false}
              onClick={() => {
                addContactList(userDetails);
              }}
              backgroundColor={BLACKLIGHT}
              padding={`4px 8px`}
              title={`Ok`}
            />
          </DivWrap>
        </Col>
      </Row>
    </ContainerWrap>
  );
}

export default NewContactForm;
