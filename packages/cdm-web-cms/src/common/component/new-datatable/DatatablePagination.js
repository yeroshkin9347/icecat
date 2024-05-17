import React from "react";
import {
  Row,
  Col,
  RoundedButton,
  Padding,
  BrowserSelect,
  BrowserSelectOption,
  Text, Input,
} from "cdm-ui-components";

function DatatablePagination({
  pageSizeOptions,
  pageCount,
  setPageNumber,
  setPageSize,
  pageSize,
  pageIndex,
  total,
  hasNextPage,
  hasPreviousPage
}) {
  return (
    <Padding all={3}>
      <Row>
        <Col col>
          <RoundedButton
            light
            onClick={() => setPageNumber(0)}
            disabled={!hasPreviousPage}
          >
            {"<<"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => setPageNumber(pageIndex - 1)}
            disabled={!hasPreviousPage}
          >
            {"<"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => setPageNumber(pageIndex + 1)}
            disabled={!hasNextPage}
          >
            {">"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => setPageNumber(pageCount - 1)}
            disabled={!hasNextPage}
          >
            {">>"}
          </RoundedButton>{" "}
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
          <Text inline>
            &nbsp;| Go to page:{" "}
            <Input
              type="number"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                setPageNumber(page);
              }}
              min={1}
              max={pageCount}
              style={{ width: "100px" }}
            />
          </Text>{" "}
        </Col>

        <Col col={2} noPadding>
          <BrowserSelect
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {pageSizeOptions.map((pageSize) => (
              <BrowserSelectOption key={pageSize} value={pageSize}>
                Show {pageSize}
              </BrowserSelectOption>
            ))}
          </BrowserSelect>
        </Col>
      </Row>
    </Padding>
  );
}
export default DatatablePagination;
