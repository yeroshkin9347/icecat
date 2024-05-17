import React from "react";
import styled from "styled-components";
import { Alert } from "cdm-ui-components";
import { DefaultLink } from "cdm-shared/component/Link";

const StyledAlert = styled(Alert)`
  color: #e6e8ff;
  border-radius: 10rem;
  border: none;
  padding-left: 1rem;
  padding-right: 1rem;
  background: rgb(38, 135, 255);
  background: -moz-linear-gradient(
    270deg,
    rgba(38, 135, 255, 1) 0%,
    rgba(125, 38, 255, 1) 100%
  );
  background: -webkit-linear-gradient(
    270deg,
    rgba(38, 135, 255, 1) 0%,
    rgba(125, 38, 255, 1) 100%
  );
  background: linear-gradient(
    270deg,
    rgba(38, 135, 255, 1) 0%,
    rgba(125, 38, 255, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#2687ff",endColorstr="#7d26ff",GradientType=1);
  font-weight: 400;

  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;

  &:before {
    display: none;
  }

  ${DefaultLink.selector} {
    color: white !important;
    &:visited {
      color: white !important;
    }
  }
`;

export default function NewsletterItem(props) {
  return <StyledAlert {...props} />;
}
