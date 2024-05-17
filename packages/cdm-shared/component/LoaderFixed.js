import React from "react";
import { Loader } from "cdm-ui-components";
import styled from "styled-components";

const LoaderFixedWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
`;


const LoaderFixed = () => {
  return (
    <LoaderFixedWrapper>
      <Loader />
    </LoaderFixedWrapper>
  );
};

export default LoaderFixed;
