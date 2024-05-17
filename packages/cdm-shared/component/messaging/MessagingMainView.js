import React from "react";
import styled from "styled-components";
import {
  TOP_ROW_HEIGHT,
  TRI_LAYOUT_FIRST_COL,
  TRI_LAYOUT_SECOND_COL,
  TRI_LAYOUT_THIRD_COL
} from "./utils";
import { Col, Row } from "cdm-ui-components";
import MessagingMenu from "./MessagingMenu";
import { useStateValue } from "../../hook/useStateValue";
import {
  MENU_ITEM_SELECTED_INBOX,
  MENU_ITEM_SELECTED_OUTBOX,
  MENU_ITEM_SELECTED_DRAFTS
} from "./reducer";
import Inbox from "./inbox/Inbox";
import Outbox from "./outbox/Outbox";
import MessageDetail from "./common/MessageDetail";
import DraftsList from "./draft/DraftsList";

const Wrapper = styled(Row)`
  z-index: 0;
  position: absolute;
  width: 100%;
  min-width: 100%;
  top: ${TOP_ROW_HEIGHT};
  left: 0;
  height: calc(100% - ${TOP_ROW_HEIGHT});
  min-height: calc(100% - ${TOP_ROW_HEIGHT});
  overflow: hidden;
  flex-wrap: nowrap;
  margin: 0;
  border-top: 1px solid ${props => `rgb(${props.theme.border.color})`};
  padding: 2rem 0 1rem 0;
`;

// Tri zone layout 1-3-8
function MessagingMainView() {
  const [
    { menuItemSelected, inboxMessageSelected, outboxMessageSelected },
    dispatch
  ] = useStateValue();

  return (
    <Wrapper>
      {/* In/Out box + Drafts */}
      <Col col={TRI_LAYOUT_FIRST_COL} noPadding>
        <MessagingMenu />
      </Col>

      {/* Messages list */}
      <Col col={TRI_LAYOUT_SECOND_COL} xl={TRI_LAYOUT_SECOND_COL - 1}>
        {/* Inbox */}
        {menuItemSelected === MENU_ITEM_SELECTED_INBOX && <Inbox />}
        {/* Outbox */}
        {menuItemSelected === MENU_ITEM_SELECTED_OUTBOX && <Outbox />}
        {/* Drafts */}
        {menuItemSelected === MENU_ITEM_SELECTED_DRAFTS && <DraftsList />}
      </Col>

      {/* Message detail */}
      <Col col={TRI_LAYOUT_THIRD_COL} xl={TRI_LAYOUT_THIRD_COL + 1}>
        {/* Inbox selected message */}
        {menuItemSelected === MENU_ITEM_SELECTED_INBOX &&
          inboxMessageSelected && (
            <MessageDetail
              {...inboxMessageSelected}
              onReply={() =>
                dispatch({ type: "reply", message: inboxMessageSelected })
              }
            />
          )}
        {/* Outbox selecdted message */}
        {menuItemSelected === MENU_ITEM_SELECTED_OUTBOX &&
          outboxMessageSelected && <MessageDetail {...outboxMessageSelected} />}
      </Col>
    </Wrapper>
  );
}
export default MessagingMainView;
