import React from "react";
import styled from "styled-components";
import {
  Modal,
  H5,
} from "cdm-ui-components";

const ModalWrapper = styled(Modal)`
  overflow: initial;
  width: 400px;
  padding: 1.5rem;
  //   min-width: 400px;
`;
const ModalBody = styled.div`
  height: 50px;
`;
const ModalHeader = styled.div`
  height: 50px;
`;
const ModalFooter = styled.div`
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const CustomModal = (props) => (
  <ModalWrapper style={{ overflow: "initial" }} sm {...props}>
    <>
      <ModalHeader>
        <H5>{props.headerTitle || ""}</H5>
      </ModalHeader>
      <ModalBody>{props.bodyContent || ""}</ModalBody>
      {props.footer && (
      <ModalFooter>{props.footer()}</ModalFooter>
      )}
    </>
  </ModalWrapper>
);

export default CustomModal;
