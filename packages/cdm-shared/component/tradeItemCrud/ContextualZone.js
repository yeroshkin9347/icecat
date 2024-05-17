import styled, { css } from "styled-components";
import { Zone } from "cdm-ui-components";

const ContextualZone = styled(Zone)`
  padding: 1.5em;
  // box-shadow: rgba(32, 33, 36, 0.28) 0px 1px 6px 0px;
  border-radius: 0.5em;
  margin-bottom: 16px;

  ${(props) =>
    props.light &&
    css`
      background-color: #f5f5f5 !important;
    `}
`;

export default ContextualZone;
