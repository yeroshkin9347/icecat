import React, { useEffect, useCallback } from "react";
import map from "lodash/map";
import InboxMessage from "./InboxListMessage";
import { useStateValue } from "../../../hook/useStateValue";
import ListScrollableWrapper from "../common/ScrollableWrapper";
import { Padding } from "cdm-ui-components";
import {
  fetchInboxMessages,
  fetchInboxMessage,
  markMessageAsRead
} from "../actions";
import { DEFAULT_BODY_CHARACTERS } from "../utils";
import useRealTimeMessaging from "../../../hook/useRealTimeMessaging";

const test = message => {};

function Inbox() {
  const [
    {
      inboxList,
      inboxMessageSelected,
      user,
      pageSize,
      pageNumber,
      filters,
      refreshCounter,
      translate
    },
    dispatch
  ] = useStateValue();

  const refresh = useCallback(() => dispatch({ type: "refresh" }), []);
  const [, clearRtMessage] = useRealTimeMessaging(null, refresh);

  const selectMessage = useCallback(
    message => {
      fetchInboxMessage(user, dispatch)(message);
      clearRtMessage(message.id);
    },
    [user, dispatch]
  );

  useEffect(() => {
    fetchInboxMessages(user, dispatch)(
      pageNumber,
      pageSize,
      DEFAULT_BODY_CHARACTERS,
      filters
    );
  }, [dispatch, user, pageNumber, pageSize, filters, refreshCounter]);

  return (
    <ListScrollableWrapper>
      {inboxList.length === 0 && (
        <Padding all={3}>
          {translate("messaging.inbox.noMessageReceived")}
        </Padding>
      )}
      {map(inboxList, message => (
        <InboxMessage
          key={`message-list-${message.id}`}
          {...message}
          selected={
            inboxMessageSelected && inboxMessageSelected.id === message.id
          }
          onClick={() => selectMessage(message)}
        />
      ))}
    </ListScrollableWrapper>
  );
}

export default Inbox;
