import React, { useCallback, useMemo } from "react";
import get from "lodash/get";
import map from "lodash/map";
import { DefaultLink } from "cdm-shared/component/Link";
import { Icon, Tooltip, Padding, Text } from "cdm-ui-components";
import styled from "styled-components";
import useRealTimeMessaging from "cdm-shared/hook/useRealTimeMessaging";
import { notifyBrowser } from "cdm-shared/utils/notification";
import { smartDateParse } from "cdm-shared/utils/date";
import { withRouter } from "react-router-dom";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { HUB_URL } from "cdm-shared/services/messaging";
import useNotifications from "cdm-shared/hook/useNotifications";
import { fetchLastestInboxMessages } from "./actions";
import withUser from "../../redux/hoc/withUser";
import { Email } from "@mui/icons-material";

const NewMessageIndicator = styled.div`
  position: absolute;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
  right: -2px;
  bottom: 10px;
  border: 1px solid #fff;
`;

const MessagesWrapper = styled.div`
  position: relative;
  width: 250px;
  max-width: 250px;
  overflow: hidden;
  text-align: left;
`;

const MessageWrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid ${(props) => `rgb(${props.theme.color.light})`};
  padding-right: 30px;
  :hover {
    background: #ececec;
  }
`;

const MessageDate = styled(Text)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

function MessagingLink({ history, translate, user, color }) {
  const [, notify] = useNotifications();
  const onMessageReceived = useCallback(
    (message) => {
      notifyBrowser(get(message, "sender"), get(message, "subject"));
      notify({
        title: get(message, "sender"),
        body: get(message, "subject"),
        dismissAfter: 5000,
        onClick: () => {
          clearMessage(message.messageId);
          history.push(
            `/messaging?selectedInboxMessageId=${message.messageId}`
          );
        },
      });
    },
    [notify, history]
  );

  const initMessages = useCallback(
    () =>
      fetchLastestInboxMessages(user)().then((res) =>
        map(res.data.results, (m) => ({
          messageId: m.id,
          sender: get(m, "sender.companyName"),
          subject: m.subject,
          sent: m.creationTimestamp,
        }))
      ),
    [user]
  );

  const [messages, clearMessage] = useRealTimeMessaging(
    HUB_URL,
    onMessageReceived,
    initMessages
  );

  const goToMessages = useCallback(() => {
    history.push(`/messaging?refreshInbox=1`);
  }, [history]);

  const goToMessage = useCallback(
    (messageId) => {
      clearMessage(messageId);
      history.push(`/messaging?selectedInboxMessageId=${messageId}`);
    },
    [clearMessage, history]
  );

  const Messages = useMemo(() => {
    if (messages.length === 0)
      return (
        <Padding all={3} center>
          <Text center>{translate("messaging.noMessageAwaiting")}</Text>
        </Padding>
      );
    return map(messages, (m, mIdx) => (
      <MessageWrapper
        key={`message-received-${mIdx}`}
        onClick={() => goToMessage(m.messageId)}
      >
        <Padding all={3}>
          <Text bold>{m.sender}</Text>
          <Padding top={1} />
          <Text gray>{m.subject}</Text>
          <MessageDate small gray>
            {smartDateParse(m.sent)}
          </MessageDate>
        </Padding>
      </MessageWrapper>
    ));
  }, [messages, translate, goToMessage]);

  return (
    <Tooltip
      interactive
      appendTo={() => document.body}
      placement="bottom"
      html={<MessagesWrapper>{Messages}</MessagesWrapper>}
    >
      <DefaultLink
        href={`/messaging`}
        onClick={(e) => {
          e.preventDefault();
          goToMessages();
        }}
        style={{ position: "relative" }}
      >
        <Email fontSize="large" style={{ color: color ? color : "#fff" }} />
        {messages.length > 0 && <NewMessageIndicator />}
      </DefaultLink>
    </Tooltip>
  );
}

export default withRouter(
  withUser(withLocalization(MessagingLink))
);
