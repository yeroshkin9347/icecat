import React from "react";
import styled from "styled-components";
import {ActivityLoader} from "./ActivityLoader";

const ButtonWrapper = styled.button`
  ${(props) => (props.disabled ? `opacity:0.6` : `opacity:1`)}
  background: ${(props) => props.backgroundColor || `blue`};
  color: ${(props) => props.color || `white`};
  border: 0;
  padding: ${(props) => props.padding || `5px 10px`};
  ${(props) => (props.disabled ? `cursor: alias` : `cursor: pointer`)};
  border-radius: ${(props) => props.borderRadius || `5`}px;
  ${(props) =>
      props.hoverBackgroundColor
          ? `border: 1px solid ${props.hoverBackgroundColor}`
          : null};
  
  :hover {
    background-color: ${(props) => props.hoverBackgroundColor || null};
    span {
      color: ${(props) => props.hoverColor || null};
    }
  }
`;
const CustomButton = (props) => {
  return (
    <ButtonWrapper {...props}>
      <span>
        {props.loader ? <ActivityLoader /> : props.title || "default"}
      </span>
    </ButtonWrapper>
  );
}

export default CustomButton;
