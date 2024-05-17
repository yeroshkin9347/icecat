import styled from "styled-components";
import {
  Zone,
  Toast,
  Input,
  Label,
  Div,
  Container,
  Textarea,
} from "cdm-ui-components";
import DatePicker from "cdm-shared/component/DatePicker";

export const InputWrap = styled(Input)`
  background-color: white;
  ${(props) =>
    props.disabled &&
    `  opacity: 0.5;
      background: #d3d3d35c;`}
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

export const CheckboxWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const DivWrap = styled(Div)`
  margin-bottom: 10px;
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : `center`};
  align-items: center;
  flex-direction: ${(props) => (props.column ? `column` : `row`)};
  ${(props) => props.width && `width:${props.width}`};
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
export const ToastWrap = styled(Toast)`
  position: fixed;
  bottom: 40px;
  z-index: 100;
`;

export const iconstyle = {
  margin: "0 10px",
  cursor: "pointer",
  color: "#717e8a",
  "&:hover": {
    background: "#000000",
  },
};

export const TextareaWrap = styled(Textarea)`
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  width: 100%;
  resize: none;
  height: 100px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;
