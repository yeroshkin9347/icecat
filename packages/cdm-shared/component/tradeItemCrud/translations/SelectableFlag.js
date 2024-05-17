import styled, { css } from "styled-components";
import Flag from "cdm-shared/component/Flag";

const SelectableFlag = styled(Flag)`
  position: relative;

  ${props =>
    props &&
    props.selected &&
    css`
      border: 2px solid rgb(${props.theme.color.primary});
      height: 32px;
      ::after {
        display: inline-block;
        position: absolute;
        content: "";
        bottom: 0px;
        left: 50%;
        width: 4px;
        height: 4px;
        background-color: rgb(${props.theme.color.primary});
        border-radius: 50%;
        transform: translateX(-50%);
        bottom: 2px;
      }
    `}
`;

export default SelectableFlag;
