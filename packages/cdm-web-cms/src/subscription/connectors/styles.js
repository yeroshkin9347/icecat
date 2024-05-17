import styled from "styled-components";
import {
  Zone,
  Toast,
  Input,
  Label,
  Div,
  Container,
} from "cdm-ui-components";
import DatePicker from "cdm-shared/component/DatePicker";

export const InputWrap = styled(Input)`
  background-color: white;
  ${(props) =>
    props.disabled &&
    `  opacity: 0.5;
      background: #d3d3d35c;`
    }
  ${(props) => !props.hideWidth && `width:100%`}
  border: 1px solid #c4c2c2;
  border-radius: 5px;
  height: 16px;
  // width: 16px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const CheckboxWrap=styled.div`
  width:100%;
  display:flex;
  justify-content:flex-start;
`;

export const DivWrap = styled(Div)`
  margin-bottom:10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ZoneWrap = styled(Zone)`
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
`;

export const ContainerWrap = styled(Container)`
  padding: 0px !important;
`;
export const LabelWrap = styled(Label)`
  margin-bottom: 0px;
  width: 50%;
  text-align: right;
`;
export const DatePickerWrap = styled(DatePicker)`
  width: 100%;
  input {
    width: 100%;
    background-color: white;
    ${(props) =>
      props.disabled &&
      `  opacity: 0.5;
      background: #d3d3d35c;`}
    ${(props) => !props.hideWidth && `width:100%`}
  border: 1px solid #c4c2c2;
    border-radius: 5px;
    height: 36px;
    :focus {
      background-color: white;
      border: 2px solid #2684ff;
    }
  }
`;
