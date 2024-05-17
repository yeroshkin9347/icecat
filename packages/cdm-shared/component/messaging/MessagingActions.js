import React from "react";
import { Row, Col, Button } from "cdm-ui-components";
import {
  TRI_LAYOUT_FIRST_COL,
  TRI_LAYOUT_SECOND_COL,
  TOP_ROW_HEIGHT,
  TRI_LAYOUT_THIRD_COL
} from "./utils";
import styled from "styled-components";
import MessagingFilters from "./MessagingFilters";
import MessagingPagination from "./MessagingPagination";
import { useStateValue } from "../../hook/useStateValue";
import Pace from "../Pace";

const TopRow = styled(Row)`
  z-index: 1;
  position: absolute;
  width: 100%;
  min-width: 100%;
  top: 0;
  left: 0;
  height: ${TOP_ROW_HEIGHT};
  min-height: ${TOP_ROW_HEIGHT};
  flex-wrap: nowrap;
  margin: 0;
  align-items: center;
`;

const LoadingView = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

// 1-3-8 Layout
function MessagingActions() {
  const [{ translate, isLoading }, dispatch] = useStateValue();
  return (
    <>
      <TopRow>
        {/* Create new message */}
        <Col col={TRI_LAYOUT_FIRST_COL}>
          <Button
            block
            small
            secondary
            shadow
            onClick={() => dispatch({ type: "newMessage" })}
          >
            {translate("messaging.newMessage")}
          </Button>
        </Col>

        {/* Filters & Search */}
        <Col col={TRI_LAYOUT_SECOND_COL} xl={TRI_LAYOUT_SECOND_COL - 1}>
          <MessagingFilters />
        </Col>

        {/* Pagination */}
        <Col col={TRI_LAYOUT_THIRD_COL} xl={TRI_LAYOUT_THIRD_COL + 1} right>
          <MessagingPagination />
        </Col>

        <LoadingView>{isLoading && <Pace />}</LoadingView>
      </TopRow>
    </>
  );
}
export default MessagingActions;
