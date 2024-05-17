import React from "react";
import Sticky from "react-stickynode";
import styled from "styled-components";
import { Div } from "cdm-ui-components";
import { PRIMARY, WHITESMOKE } from "cdm-shared/component/color";
import CustomButton from "../../common/layout/CustomButton";

export const HeaderWrapper = styled(Div)`
  display: flex;
  flex: 1;
  background: white;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin-bottom: 20px;
  padding: 30px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
  border-radius:5px;
`;
const LabelWrap = styled.label`
  font-size: 18px;
  font-weight: 500;
`;

const CustomActionsBar = ({
    goBack,
    id,
    onCreateNew,
    title,
    buttonLabel = "",
    goBackLabel = "",
    hideButton = false,
}) => (
    <Sticky enabled={true} top={`#mainNav`} innerZ={500}>
        <HeaderWrapper>
            <LabelWrap>{title}</LabelWrap>
            <div>
                <CustomButton
                    color={`#000000`}
                    onClick={goBack}
                    backgroundColor={WHITESMOKE}
                    padding={`8px 10px`}
                    title={goBackLabel}
                />
                {!hideButton && id && (
                    <CustomButton
                        style={{ marginLeft: 10 }}
                        onClick={onCreateNew}
                        backgroundColor={PRIMARY}
                        padding={`8px 10px`}
                        title={buttonLabel}
                    />
                )}
            </div>
        </HeaderWrapper>
    </Sticky>
);

export default CustomActionsBar;
