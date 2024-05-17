import styled from "styled-components";
import {
  Zone,
  Input,
  Div,
  Container
} from "cdm-ui-components";

export const InputWrap = styled(Input)`
  ${(props) => !props.hideWidth && `width:70%`}
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  height: 36px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const DivWrap = styled(Div)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ZoneWrap = styled(Zone)`
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
`;

export const ContainerWrap = styled(Container)`
  padding: 0 !important;
`;
export const IconWrap = styled(Container)`
  text-align: right;
  height: 35px;
`;
