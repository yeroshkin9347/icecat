import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import MessageDetail from "cdm-shared/component/messaging/common/MessageDetail";
import { getCmsMessage } from "cdm-shared/services/messaging";
import { LightZone, Padding } from "cdm-ui-components";
import styled from "styled-components";

const Wrapper = styled(LightZone)`
  position: relative;
  height: 100%;
  max-width: 75%;
  // margin: 2rem;
`;

const Container = styled(Padding)`
  position: relative;
  height: 100%;
  width: 100%;
`;

function UserMessageDetail() {
  const params = useParams();
  const [message, setMessage] = useState(null);

  // momoized id
  const id = useMemo(() => params.id, [params.id]);

  // get message
  useEffect(() => {
    getCmsMessage(id).then(res => setMessage(res.data));
  }, [id]);

  return (
    <Container all={3}>
      <Wrapper responsive>
        <MessageDetail {...message} />
      </Wrapper>
    </Container>
  );
}

export default UserMessageDetail;
