import React from "react";
import MessagingView from "cdm-shared/component/messaging/MessagingView";
import { Zone } from "cdm-ui-components";
import styled from "styled-components";

const Wrapper = styled(Zone)`
  height: 100%;
`;

const CustomMessagingView = props => {
  return (
    <Wrapper noPadding noShadow>
      <MessagingView {...props} />
    </Wrapper>
  );
};

export default CustomMessagingView;
