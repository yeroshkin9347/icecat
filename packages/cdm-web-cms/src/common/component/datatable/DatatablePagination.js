import React, { useMemo } from "react";
import {
  Row,
  Col,
  RoundedButton,
  Padding,
  Input,
  BrowserSelect,
  BrowserSelectOption,
  Text,
} from "cdm-ui-components";

function DatatablePagination({
  pageSizeOptions,
  pageCount,
  gotoPage,
  setPageSize,
  pageSize,
  pageIndex,
  total,
}) {
  const canNextPage = useMemo(() => pageIndex + 1 < pageCount, [
    pageIndex,
    pageCount,
  ]);
  const canPreviousPage = useMemo(() => pageIndex > 0, [pageIndex]);

  return (
    <Padding all={3}>
      <Row>
        <Col col>
          <RoundedButton
            light
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => gotoPage(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            {"<"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => gotoPage(pageIndex + 1)}
            disabled={!canNextPage}
          >
            {">"}
          </RoundedButton>{" "}
          <RoundedButton
            light
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
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
                gotoPage(page);
              }}
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
