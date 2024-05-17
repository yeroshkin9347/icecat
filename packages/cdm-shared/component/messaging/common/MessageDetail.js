import React, { useMemo, useCallback } from "react";
import {
  Padding,
  Row,
  Col,
  Text,
  H3,
  RoundedButton,
  Icon,
  LightZone,
  Tag
} from "cdm-ui-components";
import { parseDate } from "../../../utils/date";
import map from "lodash/map";
import join from "lodash/join";
import ScrollableWrapper from "./ScrollableWrapper";
import styled from "styled-components";
import { ic_reply } from "react-icons-kit/md/ic_reply";

const Wrapper = styled(LightZone)`
  height: 100%;
  padding-top: 0;
  background-color: transparent;
`;

const ScrollableArea = styled(ScrollableWrapper)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 4rem 3rem 4rem;
`;

const ReplyButton = styled(RoundedButton)`
  margin-left: 1.5rem;
`;

function MessageDetail({
  id,
  subject,
  sender,
  recipients,
  tags,
  body,
  creationTimestamp,
  selected,
  onReply
}) {
  const creationDate = useMemo(() => {
    return parseDate(creationTimestamp, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, [creationTimestamp]);

  const allowedToReply = useCallback(
    () => sender.discriminator !== "DetailedInternalUser",
    [sender]
  );
  return (
    <Wrapper responsive noShadow>
      <ScrollableArea>
        {/* main info */}
        <Row>
          {/* subject */}
          <Col col={9}>
            <H3>{subject}</H3>
          </Col>
          {/* tags */}
          <Col col={3} right>
            {tags && tags.length > 0 && (
              <Tag primary noMargin>
                {join(tags, ",")}
              </Tag>
            )}
          </Col>
        </Row>
        {/* senders/recipients */}
        <Row>
          <Col col={8}>
            {sender && <Text bold>{sender.companyName}</Text>}
            {recipients && (
              <Text bold>
                {join(
                  map(recipients, r => r.companyName),
                  ", "
                )}
              </Text>
            )}
          </Col>
          {/* date */}
          <Col col={4} right>
            <Text gray inline>
              {creationDate}
            </Text>
            {onReply && allowedToReply() && (
              <ReplyButton
                inline
                light
                onClick={() => onReply && onReply()}
                noMargin
              >
                <Icon icon={ic_reply} size={17} />
              </ReplyButton>
            )}
          </Col>
        </Row>

        <Padding top={5} />

        {/* preview */}
        <div
          dangerouslySetInnerHTML={{
            __html: body
          }}
        />
      </ScrollableArea>
    </Wrapper>
  );
}

export default React.memo(MessageDetail);
