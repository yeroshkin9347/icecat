import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { Text, Col, Row, LightZone } from "cdm-ui-components";
import { MESSAGE_LIST_MESSAGE_HEIGHT } from "../utils";
import withTheme from "../../../redux/hoc/withTheme";
import { smartDateParse } from "../../../utils/date";
import map from "lodash/map";
import join from "lodash/join";

const MessageWrapper = styled(LightZone)`
  position: relative;
  height: ${MESSAGE_LIST_MESSAGE_HEIGHT};
  min-height: ${MESSAGE_LIST_MESSAGE_HEIGHT};
  padding: 1rem;
  margin-bottom: 1rem;
  // border-bottom: 1px solid ${props => `rgb(${props.theme.color.light})`};
  cursor: pointer;

  :hover {
    ${props =>
      !props.selected &&
      css`
        background-color: rgba(255, 255, 255, 0.1);
      `}
  }

  ${props =>
    props.selected &&
    css`
      background-color: rgba(255, 255, 255, 0.18);
      :before {
        content: "";
        // background-color: #fff;
        position: absolute;
        width: 20px;
        height: 20px;
        right: -6px;
        transform: rotateZ(45deg) translateY(-50%);
        top: 50%;
      }
    `}
`;

const MainRowItem = styled(Text)`
  font-weight: bold;
  display: inline-block;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Body = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  height: 50px;
  max-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadMark = styled.div`
  position: relative;
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.4rem;
  background-color: ${props => `rgb(${props.theme.color.primary})`};
  border-radius: 10px;
  vertical-align: middle;
  top: -1px;
}
`;

function ListItemMessage({
  id,
  subject,
  sender,
  recipients,
  body,
  creationTimestamp,
  selected,
  isRead,
  // ui
  noPreview,
  // functions
  onClick
}) {
  const creationDate = useMemo(() => {
    return smartDateParse(creationTimestamp);
  }, [creationTimestamp]);

  return (
    <MessageWrapper selected={selected} onClick={() => onClick && onClick()}>
      {/* main info */}
      <Row>
        {/* senders/recipients */}
        <Col col={4}>
          {sender && (
            <MainRowItem>
              {isRead === false && <UnreadMark />} {sender.companyName}
            </MainRowItem>
          )}
          {recipients && (
            <MainRowItem>
              {isRead === false && <UnreadMark />}
              {join(
                map(recipients, r => r.companyName),
                ", "
              )}
            </MainRowItem>
          )}
        </Col>
        {/* subject */}
        <Col col={6} noPadding>
          <MainRowItem maxHeight="5px">{subject}</MainRowItem>
        </Col>
        {/* date */}
        <Col col={2} right>
          <MainRowItem inline small gray>
            {creationDate}
          </MainRowItem>
        </Col>
      </Row>

      {/* preview */}
      <Row>
        <Col col={12}>{!noPreview && <Body>{body}</Body>}</Col>
      </Row>
    </MessageWrapper>
  );
}
export default React.memo(withTheme(ListItemMessage));
