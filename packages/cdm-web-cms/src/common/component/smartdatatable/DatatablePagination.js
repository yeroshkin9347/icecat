import React from "react";
import {
  Row,
  Col,
  Padding,
  Text,
} from "cdm-ui-components";

import styled from "styled-components";

const CustomButton = styled.button`
  display: inline;
  background: #2786fc;
  ${(props) => (props.disabled ? `opacity:0.7;` : null)}
  padding: 5px 10px;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  ${(props) => (props.disabled || props.label ? `cursor:alias;` : `cursor:pointer;`)}
  margin:0 4px;
`;
const ColWrap = styled(Col)`
 display:flex;
 justify-content:space-between
`;

function DatatablePagination({
  pageCount,
  setPageNumber,
  pageIndex,
  total,
  hasNextPage,
  hasPreviousPage,
}) {
  return (
    <Padding all={3}>
      <Row>
        <ColWrap col>
          <div>
            <Text inline>
              Page{" "}
              <Text bold inline>
                {pageIndex + 1} of {pageCount}
              </Text>{" "}
            </Text>
            <Text inline>
              &nbsp;|&nbsp;
              <Text bold inline>
                {total}
              </Text>{" "}
              results{" "}
            </Text>
          </div>
          <div>
            <CustomButton
              onClick={() => setPageNumber(0)}
              disabled={!hasPreviousPage}
            >
              {"First"}
            </CustomButton>
            <CustomButton
              onClick={() => setPageNumber(pageIndex - 1)}
              disabled={!hasPreviousPage}
            >
              {"Previous"}
            </CustomButton>
            <CustomButton label={true}>{pageIndex + 1}</CustomButton>
            <CustomButton
              onClick={() => setPageNumber(pageIndex + 1)}
              disabled={!hasNextPage}
            >
              {"Next"}
            </CustomButton>
            <CustomButton
              onClick={() => setPageNumber(pageCount - 1)}
              disabled={!hasNextPage}
            >
              {"Last"}
            </CustomButton>
          </div>
        </ColWrap>
      </Row>
    </Padding>
  );
}
export default DatatablePagination;
