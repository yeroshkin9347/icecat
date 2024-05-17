import React from "react";
import MessagingView from "cdm-shared/component/messaging/MessagingView";
import styled from "styled-components";
import { Container } from "cdm-ui-components";
import { TOP_ROW_PADDING_TOP } from "./utils";

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  margin: 2rem;
`;

const FullHeightFixedContainer = styled(Container)`
  position: absolute;
  left: 0;
  display: inline-block;
  height: calc(100% - ${TOP_ROW_PADDING_TOP});
  width: 100%;
  overflow: hidden;
  padding: 0 0 0 0 !important;
`;

function EmbeddedMessagingView() {
  return (
    <Wrapper>
      <FullHeightFixedContainer fluid>
        <MessagingView />
      </FullHeightFixedContainer>
    </Wrapper>
  );
}

export default EmbeddedMessagingView;
