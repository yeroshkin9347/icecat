import React from 'react';
import CustomButton from "../../common/layout/CustomButton";
import { PRIMARY, SECONDARY } from "cdm-shared/component/color";
import styled from "styled-components";

export const DivWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
function ButtonRow({ onSave, title, title2,onDelete = null }) {
    return (
        <DivWrap>
            {onDelete && (
                <CustomButton
                    style={{ marginRight: 10 }}
                    onClick={onDelete}
                    backgroundColor={SECONDARY}
                    padding={`8px 10px`}
                    title={title2}
                />
            )}
            <CustomButton
                style={{ marginRight: 10 }}
                onClick={onSave}
                backgroundColor={PRIMARY}
                padding={`8px 10px`}
                title={title}
            />
        </DivWrap>
    );
}

export default ButtonRow;
