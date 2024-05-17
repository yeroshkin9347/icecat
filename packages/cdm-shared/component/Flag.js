import React from "react";
import styled, { css } from "styled-components";
import split from "lodash/split";
import "../assets/flags.png";
import "../assets/flags.min.css";
import memoize from "cdm-shared/utils/memoizeFn";

const FlagWrapper = styled.span`
  display: inline-block;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  ${props =>
    props.size &&
    css`
      width: ${props.size};
    `}
`;

const Img = styled.img`
  position: relative;
  width: 100% !important;

  ${props =>
    props.size &&
    css`
      width: ${props.size} !important;
    `}
`;

const getParsedCode = code => {
  if (code) {
    const codes = split(code, /[_-]/g);
    return (codes[1] || codes[0] || '').toLowerCase();
  }

  return "";
}

const Flag = ({
  code,
  size,
  // functions
  onClick,
  ...otherProps
}) => {
  return (
    <FlagWrapper onClick={onClick} size={size} {...otherProps}>
      <Img
        size={size}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        alt={code}
        className={`flag flag-${getParsedCode(code)}`}
      />
    </FlagWrapper>
  );
};

export default memoize(Flag);
