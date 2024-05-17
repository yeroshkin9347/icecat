import React from "react";
import styled from "styled-components";
import useNotifications from "../../hook/useNotifications";
import Notification from "./Notification";
import { useTransition, animated } from "react-spring";

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column-reverse;
  z-index: 5000;
  width: 0 auto;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

function NotificationContainer() {
  const [notifications] = useNotifications();

  const transitions = useTransition(notifications, item => `n-${item.id}`, {
    from: { transform: "translate3d(0,40px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { transform: "translate3d(0,40px,0)", opacity: 0 }
  });

  const Notifications = transitions.map(({ item, props, key }) => {
    return (
      <animated.div key={`global-notif-${key}`} style={props}>
        <Notification {...item} />
      </animated.div>
    );
  });

  return <Wrapper>{Notifications}</Wrapper>;
}

export default NotificationContainer;
