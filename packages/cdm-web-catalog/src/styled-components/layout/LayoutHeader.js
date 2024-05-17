import React from "react";
import isNil from "lodash/isNil";
import styled from "styled-components";
import { Zone } from "cdm-ui-components";
import { PageTitle } from "cdm-shared/component/Banner";
import { Box, Typography } from "@mui/material";

const StyledZone = styled(Zone)`
  padding-top: 24px;
  padding-bottom: 0px;
  padding-left: 2rem;
  padding-right: 2rem;
`;

export const LayoutHeader = ({ title, subtitle, description, rightSideItems = [] }) => {
  return (
    <StyledZone transparent noShadow responsive>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <PageTitle>
          <span>{title}</span>
        </PageTitle>
        <Box sx={{ display: "flex", gap: 1 }}>
          {rightSideItems.map((item, idx) => {
            return (
              <React.Fragment key={`RightSideItem${idx}`}>{item}</React.Fragment>
            );
          })}
        </Box>
      </Box>
      {!isNil(subtitle) && (
        <Typography fontSize="1.3rem" sx={{ mt: 2 }} color="#9e9e9e">
          {subtitle}
        </Typography>
      )}
      {!isNil(description) && (
        <Typography sx={{ mt: 2 }}>{description}</Typography>
      )}
    </StyledZone>
  );
}