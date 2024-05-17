import React from "react";
import styled from "styled-components";

const NotificationWrapper = styled.div`
  position: relative;
  overflow: hidden;
  text-align: left;
  bottom: 0;
  width: 300px;
  border-radius: 10px;
  margin-bottom: 1.5rem;

  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.01),
    0 3px 14px 2px rgba(0, 0, 0, 0.1), 0 5px 5px -3px rgba(0, 0, 0, 0.03);
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.8rem;
`;

const Content = styled.div`
  cursor: pointer;
  overflow: hidden;
  padding: 1rem 2rem;
  background-color: ${props => props.bg};
  color: ${props => props.text};
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.01),
    0 3px 14px 2px rgba(0, 0, 0, 0.1), 0 5px 5px -3px rgba(0, 0, 0, 0.03);
`;

const colors = {
  info: { bg: '#0288d1', text: 'white' },
  success: { bg: '#2e7d32', text: 'white' },
  warning: { bg: '#ed6c02', text: 'white' },
  error: { bg: '#d32f2f', text: 'white' },
  default: { bg: 'white', text: 'black' },
};

const Notification = ({ title, body, severity, onClick }) => {
  const color = colors[severity] || colors.default;
  return (
    <NotificationWrapper onClick={onClick}>
      <Content bg={color.bg} text={color.text}>
        <NotificationTitle>{title}</NotificationTitle>
        {body || <></>}
      </Content>
    </NotificationWrapper>
  );
};

export default Notification;
