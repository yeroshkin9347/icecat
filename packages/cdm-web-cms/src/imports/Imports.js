import React, { useCallback, useEffect, useMemo } from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import ImportProducts from "cdm-shared/component/import/ImportProducts";
import { Zone, Row, Col, Margin, ProgressBar, Text } from "cdm-ui-components";
import usePaginatedData from "cdm-shared/hook/usePaginatedData";
import { getPagedImportJobsCms } from "cdm-shared/services/import";
import get from "lodash/get";
import { smartDateParse } from "cdm-shared/utils/date";
import Datatable from "common/component/datatable/Datatable";
import styled from "styled-components";
import { DefaultLink, PrimaryLink } from "cdm-shared/component/Link";

const DEFAULT_PAGE_SIZE = 20;

const DefaultColumnWrapper = styled.div`
  min-width: 100px;
  display: inline-block;
  position: relative;
`;

function Imports({ translate }) {
  const [importJobs, fetchImportJobs] = usePaginatedData({
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // search import jobs
  const search = useCallback(
    (pageNumber, pageSize) => {
      const promise = getPagedImportJobsCms(pageNumber, pageSize);
      return fetchImportJobs(promise, pageNumber, pageSize);
    },
    [fetchImportJobs]
  );

  // on filter changed/component mount
  useEffect(() => {
    search(0, DEFAULT_PAGE_SIZE);
  }, [search]);

  // columns
  const columns = useMemo(() => {
    return [
      {
        Header: translate("importReports.table.status"),
        columns: [
          {
            Header: "",
            id: "status",
            accessor: (r) => (
              <DefaultColumnWrapper>
                <ProgressBar
                  sm
                  total={get(r, "countTradeItemToImport", 0)}
                  success={
                    get(r, "countTradeItemImported", 0) +
                    get(r, "countTradeItemNotChanged", 0)
                  }
                  danger={get(r, "countTradeItemImportFailed", 0)}
                  pending={
                    get(r, "countTradeItemToImport", 0) -
                    get(r, "countTradeItemImported", 0) -
                    get(r, "countTradeItemNotChanged", 0) -
                    get(r, "countTradeItemImportFailed", 0)
                  }
                />
              </DefaultColumnWrapper>
            ),
          },
          {
            Header: translate("importReports.table.start"),
            id: "startTimestamp",
            accessor: (d) => (
              <DefaultColumnWrapper>
                {smartDateParse(d.startTimestamp)}
              </DefaultColumnWrapper>
            ),
          },
        ],
      },
      {
        Header: translate("importReports.table.manufacturer"),
        columns: [
          {
            Header: translate("importReports.table.importName"),
            accessor: "manufacturerEntity.name",
          },
          {
            Header: translate("importReports.table.user"),
            id: "user",
            accessor: (d) => (
              <DefaultColumnWrapper>
                {get(d, "user", null)
                  ? get(d, "user.displayName")
                  : translate("importReports.table.droppedFtp")}
              </DefaultColumnWrapper>
            ),
          },
        ],
      },
      {
        Header: translate("importReports.table.counts"),
        columns: [
          {
            Header: translate("importReports.table.numberOfProducts"),
            className: "text-center",
            accessor: "countTradeItemToImport",
          },
          {
            Header: translate("importReports.table.numberOfProductsImported"),
            className: "text-center",
            accessor: "countTradeItemImported",
          },
          {
            Header: translate("importReports.table.numberOfProductsNotChanged"),
            className: "text-center",
            accessor: "countTradeItemNotChanged",
          },
          {
            Header: translate("importReports.table.numberOfFailedImports"),
            className: "text-center",
            id: "numberOfImportErrors",
            accessor: (d) =>
              get(d, "numberOfImportErrors") > 0 ? (
                <Text danger>{get(d, "numberOfImportErrors")}</Text>
              ) : (
                0
              ),
          },
          {
            Header: translate("importReports.table.numberOfMappingErrors"),
            className: "text-center",
            id: "numberOfMappingErrors",
            accessor: (d) =>
              get(d, "numberOfMappingErrors") > 0 ? (
                <Text danger>{get(d, "numberOfMappingErrors")}</Text>
              ) : (
                0
              ),
          },
        ],
      },
      {
        Header: translate("importReports.table.actions"),
        columns: [
          {
            Header: "",
            className: "text-center",
            id: "actions",
            width: 200,
            accessor: (report) => (
              <DefaultColumnWrapper>
                <DefaultLink href={get(report, "excelFileUrl")}>
                  {translate("importReports.meta.matrix")}
                </DefaultLink>
                &nbsp;&nbsp;
                {(get(report, "numberOfImportErrors") > 0 ||
                  get(report, "numberOfMappingErrors") > 0) && (
                  <PrimaryLink
                    to={`/import-reports/errors/${get(report, "id")}`}
                  >
                    <Text danger inline>
                      {translate("importReports.meta.errors")}
                    </Text>
                  </PrimaryLink>
                )}
              </DefaultColumnWrapper>
            ),
          },
        ],
      },
    ];
  }, [translate]);

  return (
    <>
      <ImportProducts height="150px" importsLink={`/imports`} />

      <Margin top={3} />
      <Zone>
        <Row>
          <Col col>
            <Datatable
              loading={importJobs.loading}
              columns={columns}
              data={importJobs.data}
              total={importJobs.total}
              showPaginationTop={true}
              onPageSizeChange={(size) => search(0, size)}
              onPageChange={(page) => search(page, importJobs.pageSize)}
              pageSizeOptions={[20, 30]}
              pageSize={importJobs.pageSize}
              page={importJobs.pageNumber}
            />
          </Col>
        </Row>
      </Zone>
    </>
  );
}

export default withLocalization(Imports);
