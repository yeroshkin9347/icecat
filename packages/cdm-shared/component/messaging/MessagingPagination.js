import React, { useMemo } from "react";
import { Text, RoundedButton, Icon } from "cdm-ui-components";
import { ic_keyboard_arrow_left } from "react-icons-kit/md/ic_keyboard_arrow_left";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
import { ic_refresh } from "react-icons-kit/md/ic_refresh";
import { useStateValue } from "../../hook/useStateValue";
import styled from "styled-components";

const Wall = styled.div`
  position: relative;
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: ${props => `rgb(${props.theme.color.light})`};
  margin: 0 12px;
  top: 6px;
`;

function MessagingPagination() {
  const [
    { pageNumber, pageSize, total, translate },
    dispatch
  ] = useStateValue();

  const pageFrom = useMemo(() => pageSize * pageNumber + 1, [
    pageNumber,
    pageSize
  ]);
  const pageTo = useMemo(() => pageSize * (pageNumber + 1), [
    pageNumber,
    pageSize
  ]);

  return (
    <>
      <Text small gray inline>
        {translate("messaging.pagination", { pageFrom, pageTo, total })}
        &nbsp;&nbsp;&nbsp;&nbsp;
      </Text>

      <RoundedButton
        light
        onClick={() => dispatch({ type: "setPreviousPage" })}
      >
        <Icon icon={ic_keyboard_arrow_left} size={17} />
      </RoundedButton>

      <RoundedButton
        light
        onClick={() => dispatch({ type: "setNextPage" })}
        noMargin
      >
        <Icon icon={ic_keyboard_arrow_right} size={17} />
      </RoundedButton>

      <Wall />

      <RoundedButton light onClick={() => dispatch({ type: "refresh" })}>
        <Icon icon={ic_refresh} size={17} />
      </RoundedButton>
    </>
  );
}

export default MessagingPagination;
