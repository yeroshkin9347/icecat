import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
`;

const Main = styled.div.attrs(props => ({
  style: {
    width: Math.floor(props.width * 100) + "%",
    height: props.height || "2px"
  }
}))`
  background-color: rgb(${props => props.theme.color.secondary});
  border-radius: ${props => props.theme.border.radius};
  transition: width 0.5s;
`;

function Pace() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setWidth(w => w + (1 - w) * 0.2),
      500 + 200 * Math.random()
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Wrapper>
      <Main width={width} />
    </Wrapper>
  );
}

export default React.memo(Pace);
