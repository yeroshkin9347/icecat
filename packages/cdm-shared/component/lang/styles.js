import styled from "styled-components";
import {
  Input,
  Div,
  Textarea,
} from "cdm-ui-components";

export const InputWrap = styled(Input)`
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  width: 70%;
  height: 36px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const TextareaWrap = styled(Textarea)`
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  width: 70%;
  height: 100px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const DivWrap = styled(Div)`
  display: flex;
  width: 100%;
  // justify-content: space-between;
  justify-content: flex-end;
  align-items: center;
`;

export const LangWrapper = styled.div`
  display: flex;
  margin-left: 10px;
  margin-bottom: 10px;
`;
