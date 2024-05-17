import React, { useEffect } from "react";
import map from "lodash/map";
import OutboxListMessage from "./OutboxListMessage";
import { useStateValue } from "../../../hook/useStateValue";
import ListScrollableWrapper from "../common/ScrollableWrapper";
import { Padding } from "cdm-ui-components";
import { fetchOutboxMessages, fetchOutboxMessage } from "../actions";
import { DEFAULT_BODY_CHARACTERS } from "../utils";

function MessagingMessageList() {
  const [
    {
      outboxList,
      outboxMessageSelected,
      user,
      pageSize,
      pageNumber,
      filters,
      refreshCounter,
      translate
    },
    dispatch
  ] = useStateValue();

  useEffect(() => {
    fetchOutboxMessages(user, dispatch)(
      pageNumber,
      pageSize,
      DEFAULT_BODY_CHARACTERS,
      filters
    );
  }, [dispatch, user, pageNumber, pageSize, filters, refreshCounter]);

  return (
    <ListScrollableWrapper>
      {outboxList.length === 0 && (
        <Padding all={3}>{translate("messaging.outbox.noMessageSent")}</Padding>
      )}
      {map(outboxList, message => (
        <OutboxListMessage
          key={`message-list-outbox-${message.id}`}
          {...message}
          selected={
            outboxMessageSelected && outboxMessageSelected.id === message.id
          }
          onClick={() => fetchOutboxMessage(user, dispatch)(message)}
        />
      ))}
    </ListScrollableWrapper>
  );
}

export default MessagingMessageList;
