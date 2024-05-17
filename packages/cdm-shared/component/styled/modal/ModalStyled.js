import { Button, H4, Modal } from "cdm-ui-components";
import styled from "styled-components";

export const ModalStyled = styled(Modal)`
  top: calc(50% + 30px) !important;
  max-height: calc(95% - 70px) !important;
  padding: 2rem;
  border-radius: 4px;
`;

export const ModalTitleStyled = styled(H4)`
  color: #264697;
  font-Weight: 500;
`;
