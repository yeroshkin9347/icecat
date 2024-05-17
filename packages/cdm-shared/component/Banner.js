import React from "react";
import { H3 } from "cdm-ui-components";

const Banner = ({ children, noPadding = false }) => (
  <div style={{ padding: !noPadding ? "2rem 2rem 0px 2rem" : "none" }}>
    <PageTitle>{children}</PageTitle>
  </div>
);

export default Banner;

export const PageTitle = ({ children }) => (
  <H3
    style={{
      color: "#264697",
      marginBottom: "0px",
      fontWeight: "500",
    }}
  >
    {children}
  </H3>
);
