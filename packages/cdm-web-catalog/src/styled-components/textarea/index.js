import styled from "styled-components";
import { Textarea as CdmTextarea } from "cdm-ui-components";

const Textarea = styled(CdmTextarea)`
  box-shadow: var(--input-box-shadow);
  transition: var(--input-transition);
  color: var(--input-color);
  font-family: var(--input-font-family);
  background-color: var(--input-bg);
`;

export default Textarea;