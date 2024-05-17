import styled from "styled-components";

export const FormField = styled.div`
  label, p {
    color: ${props => (props.error ? '#ff4c52' : 'inherit')};
  }
  & > input,
  & > .cde-select > div {
    border: ${props => (props.error ? '1px solid #ff4c52 !important' : '0')};
  }
`;
