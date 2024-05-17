import React from "react";
import Menu, { MENU_HEIGHT, SIDEBAR_WIDTH } from "menu";
import Sidebar from "menu/Sidebar";
import styled from "styled-components";
import { Container, Row, Col } from "cdm-ui-components";

const ContentWrapper = styled(Container)`
  min-height: calc(100% - ${MENU_HEIGHT});
  display: flex;
  padding-left: ${props => props.hideMenu ? '15px' : SIDEBAR_WIDTH};
`;

const ContentCol = styled(Col)`
  min-height: 100%;
  background-color: ${(props) => `rgb(${props.theme.color.light})`};
  padding: 2rem;
`;

const ChildrenWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  // padding: 2rem 1rem;
`;

const ContentRow = styled(Row)`
  flex: 1;
  margin-left: ${props => props.hideMenu ? '-15px' : 0};
`;

const AdminLayout = (props) => {
  const params = new URLSearchParams(window.location.search);
  const hideMenu = params.get('hideMenu') === 'true';
  return (
    <>
      <Menu />
      <ContentWrapper fluid hideMenu={hideMenu}>
        <ContentRow hideMenu={hideMenu}>
          <ContentCol col={12}>
            <ChildrenWrapper>{props?.children}</ChildrenWrapper>
          </ContentCol>
        </ContentRow>
      </ContentWrapper>
			{!hideMenu && <Sidebar />}
    </>
  );
};

export default AdminLayout;
