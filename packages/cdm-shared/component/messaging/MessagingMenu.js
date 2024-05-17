import React from "react";
import styled from "styled-components";
import { List, ListItem, Icon, Text } from "cdm-ui-components";
import { ic_inbox } from "react-icons-kit/md/ic_inbox";
import { ic_send } from "react-icons-kit/md/ic_send";
import { ic_drafts } from "react-icons-kit/md/ic_drafts";
import { useStateValue } from "../../hook/useStateValue";
import {
  MENU_ITEM_SELECTED_INBOX,
  MENU_ITEM_SELECTED_OUTBOX,
  MENU_ITEM_SELECTED_DRAFTS
} from "./reducer";

const MenuTitle = styled(Text)`
  font-size: 0.9375rem;
  margin-left: 0.8rem;
  font-weight: 500;
`;

function MessagingMenu() {
  const [{ menuItemSelected, translate }, dispatch] = useStateValue();
  return (
    <List stacked>
      <ListItem
        selected={menuItemSelected === MENU_ITEM_SELECTED_INBOX}
        onClick={() => dispatch({ type: "setMenuItemSelected", value: 0 })}
      >
        <Icon icon={ic_inbox} size={20} />
        &nbsp;&nbsp;
        <MenuTitle inline bold>
          {translate("messaging.menu.inbox")}
        </MenuTitle>
      </ListItem>
      <ListItem
        selected={menuItemSelected === MENU_ITEM_SELECTED_OUTBOX}
        onClick={() => dispatch({ type: "setMenuItemSelected", value: 1 })}
      >
        <Icon icon={ic_send} size={20} />
        &nbsp;&nbsp;
        <MenuTitle inline bold>
          {translate("messaging.menu.outbox")}
        </MenuTitle>
      </ListItem>
      <ListItem
        selected={menuItemSelected === MENU_ITEM_SELECTED_DRAFTS}
        onClick={() => dispatch({ type: "setMenuItemSelected", value: 2 })}
      >
        <Icon icon={ic_drafts} size={20} />
        &nbsp;&nbsp;
        <MenuTitle inline bold>
          {translate("messaging.menu.drafts")}
        </MenuTitle>
      </ListItem>
    </List>
  );
}

export default MessagingMenu;
