import React from "react";
import styled from "styled-components";
import { BackgroundZone, Overlay, Zone } from "cdm-ui-components";
import { CDM_SIMPLE_BANNER_WEB } from "common/environment";

const PresentationContainer = styled(BackgroundZone)`
  width: 100%;
  height: 100%;
  padding: 0;
`;

const Presentation = ({ children }) => {
  return (
    <PresentationContainer url={CDM_SIMPLE_BANNER_WEB}>
      <Overlay gradient>
        <Zone
          transparent
          noShadow
          center
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {children}
        </Zone>
      </Overlay>
    </PresentationContainer>
  );
};

export default Presentation;
