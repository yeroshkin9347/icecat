import styled from "styled-components";

const ScrollableWrapper = styled.div`
  position: relative;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
`;

export default ScrollableWrapper;
