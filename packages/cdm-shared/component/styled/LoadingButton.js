import styled from "styled-components";
import { Button } from "cdm-ui-components";

export const LoadingButton = styled(Button)`
  opacity: ${props => props.loading ? 0.6 : 1};
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  &::after {
    display: inline;
    content: '${props => props.loading ? '...' : ''}';
  }
`;
