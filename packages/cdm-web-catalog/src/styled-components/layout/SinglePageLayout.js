import React from "react";
import { isNil } from "lodash";
import Sticky from "react-stickynode";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PageTitle } from "cdm-shared/component/Banner";
import { Zone, Padding } from "cdm-ui-components";
import ActionBar from "styled-components/action-bar/ActionBar";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { LayoutHeader } from "./LayoutHeader";
import { MENU_MAIN_HEIGHT } from "menu";

const NonBottomPaddingZone = styled(Zone)`
  padding-bottom: 0;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const SIDEBAR_WIDTH_BREAKPOINT = {
  xs: 250,
  sm: 350,
  md: 450,
};

const MainZone = ({
  title,
  subtitle,
  description,
  breadcrumbs = [{ route: "/", title: "Home" }],
  rightSideItems,
  children,
}) => {
  return (
    <Box className="background-main" sx={{ flex: 1, height: "100%" }}>
      <ActionBar showProductSearch>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map(({ title, route }, index) => {
            const isActive = breadcrumbs.length === index + 1;
            if (!isActive && !isNil(route)) {
              return (
                <Link
                  key={`Link${title}${route}`}
                  underline="hover"
                  color="inherit"
                  to={route}
                >
                  {title}
                </Link>
              );
            }
            else {
              return (
                <Typography key={`Text${title}${route}`} color="text.primary">
                  {title}
                </Typography>
              );
            }
          })}
        </Breadcrumbs>
      </ActionBar>

      <LayoutHeader title={title} subtitle={subtitle} description={description} rightSideItems={rightSideItems} />

      <NonBottomPaddingZone transparent noShadow responsive>
        <Padding vertical={3}>
          {children}
        </Padding>
      </NonBottomPaddingZone>
    </Box>
  );
}

const Sidebar = ({ children }) => {
  return (
    <Sticky top={40} innerZ={2004}>
      <Padding all={4}>
        <PageTitle>Filters</PageTitle>
        <Padding bottom={4} />
        {children}
      </Padding>
    </Sticky>
  )
}

export const SinglePageLayout = ({
  title,
  subtitle,
  description,
  breadcrumbs = [{ route: "/", title: "Home" }],
  children,
  sidebar,
  sidebarProps = {},
  rightSideItems,
}) => {
  const mainZoneProps = { title, subtitle, description, breadcrumbs, rightSideItems };

  if (sidebar) {
    return (
      <Box display="flex" flexWrap="nowrap">
        <Box
          style={{
            borderRight: `1px solid  rgb(224, 224, 224)`,
            backgroundColor: "#f8f9fa",
            minHeight: `calc(100vh - ${MENU_MAIN_HEIGHT})`,
          }}
          sx={{
            width: SIDEBAR_WIDTH_BREAKPOINT,
            minWidth: SIDEBAR_WIDTH_BREAKPOINT,
          }}
        >
          <Sidebar {...sidebarProps}>
            {sidebar}
          </Sidebar>
        </Box>
        <Box flexGrow={1}>
          <MainZone {...mainZoneProps}>
            {children}
          </MainZone>
        </Box>
      </Box>
    )
  }
  return (
    <MainZone {...mainZoneProps}>
      {children}
    </MainZone>
  );
};
