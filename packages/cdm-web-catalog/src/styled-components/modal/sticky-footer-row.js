import { Row } from "cdm-ui-components";
import styled from "styled-components";

export const StickyFooterRow = styled(Row)`
  position: sticky;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  margin: 0;
`;
