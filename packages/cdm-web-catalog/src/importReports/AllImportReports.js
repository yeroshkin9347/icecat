import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import { Padding, ProgressBar, Text } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Table from "cdm-shared/component/Table";
import { getDateTime } from "cdm-shared/utils/date";
import { getPagedImportJobs } from "cdm-shared/services/import";
import Link, { ExternalLink } from "cdm-shared/component/Link";
import withUser, { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { SinglePageLayout } from "styled-components/layout";
import { isManufacturer } from "cdm-shared/redux/hoc/withAuth";

class AllImportReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      total: 0,
      loading: false,
      pageNumber: 0,
      pageSize: 20,
      intervalId: null,
    };
    this.search = this.search.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const { pageSize, pageNumber } = this.state;

    this.search(pageNumber, pageSize);

    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    var intervalId = setInterval(this.onRefresh, 10000);
    this.setState({ intervalId });
  }

  stopTimer() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  onRefresh() {
    this.search(this.state.pageNumber, this.state.pageSize);
  }

  search(pageNumber, pageSize) {
    const { getCurrentUser } = this.props;

    this.setState({ loading: true, pageNumber, pageSize });

    getPagedImportJobs(
      pageSize,
      pageNumber,
      getManufacturerId(getCurrentUser())
    )
      .then((res) =>
        this.setState({
          loading: false,
          results: get(res, "data.results"),
          total: get(res, "data.total"),
        })
      )
      .catch((err) => this.setState({ loading: false }));
  }

  onViewMatrix(e, report) {
    e.preventDefault();
    e.stopPropagation();

    const { translate } = this.props;
    const totalCount = get(report, "countTradeItemToPrecompute", 0);
    const percent = get(report, "percentagePrecomputingJobProcessed", 0);
    if (totalCount > 0 && percent < 100) {
      if (!window.confirm(translate('importReports.errors.exportWarning'))) {
        return;
      }
    }
    window.open(get(report, "excelFileUrl"), "_blank ");
  }

  render() {
    const { results, total, pageNumber, pageSize } = this.state;

    const { user, translate } = this.props;
    const isManufacturerUser = isManufacturer(user);

    return (
      <SinglePageLayout
        title={translate("importReports.meta.title")}
        subtitle={translate("importReports.meta.subtitle")}
        breadcrumbs={[
          { title: translate("header.nav.home"), route: "/" },
          { title: translate("importReports.meta.title") }
        ]}
      >
        <Table
          columns={[
            {
              Header: translate("importReports.table.status"),
              className: "text-center",
              id: "status",
              accessor: (report) => (
                <Padding top={2}>
                  <ProgressBar
                    sm
                    total={get(report, "countTradeItemToImport", 0)}
                    success={
                      get(report, "countTradeItemImported", 0) +
                      get(report, "countTradeItemNotChanged", 0)
                    }
                    danger={get(report, "countTradeItemImportFailed", 0)}
                    pending={
                      get(report, "countTradeItemToImport", 0) -
                      get(report, "countTradeItemImported", 0) -
                      get(report, "countTradeItemNotChanged", 0) -
                      get(report, "countTradeItemImportFailed", 0)
                    }
                  />
                </Padding>
              ),
            },
            {
              Header: translate("importReports.table.start"),
              id: "startTimestamp",
              accessor: (d) => getDateTime(get(d, "startTimestamp", null)),
            },
            {
              Header: translate("importReports.table.importName"),
              className: "text-center",
              accessor: "manufacturerEntity.name",
            },
            {
              Header: translate("importReports.table.user"),
              id: "user",
              accessor: (d) =>
                get(d, "user", null)
                  ? get(d, "user.displayName")
                  : translate("importReports.table.droppedFtp"),
            },
            {
              Header: translate("importReports.table.numberOfProducts"),
              className: "text-center",
              accessor: "countTradeItemToImport",
            },
            {
              Header: translate(
                "importReports.table.numberOfProductsImported"
              ),
              className: "text-center",
              accessor: "countTradeItemImported",
            },
            {
              Header: translate(
                "importReports.table.numberOfProductsNotChanged"
              ),
              className: "text-center",
              accessor: "countTradeItemNotChanged",
            },
            {
              Header: translate(
                "importReports.table.numberOfFailedImports"
              ),
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
              Header: translate(
                "importReports.table.numberOfMappingErrors"
              ),
              className: "text-center",
              id: "numberOfMappingErrors",
              accessor: (d) =>
                get(d, "numberOfMappingErrors") > 0 ? (
                  <Text danger>{get(d, "numberOfMappingErrors")}</Text>
                ) : (
                  0
                ),
            },
            ...(isManufacturerUser ? [{
              Header: translate("importReports.table.exportReadiness"),
              className: "text-center",
              id: "precomputingProgress",
              accessor: (report) => {
                const totalCount = get(report, "countTradeItemToPrecompute", 0);
                return (
                  <Padding top={2}>
                    <ProgressBar
                      sm
                      total={totalCount || 1}
                      success={
                        totalCount ? totalCount * get(report, "percentagePrecomputingJobProcessed", 0) / 100 : 1
                      }
                    />
                  </Padding>
                );
              },
            }] : []),
            {
              Header: translate("importReports.table.actions"),
              className: "text-center",
              id: "actions",
              width: 200,
              accessor: (report) => (
                <>
                  <ExternalLink href="" onClick={(e) => this.onViewMatrix(e, report)}>
                    {translate("importReports.meta.matrix")}
                  </ExternalLink>
                  &nbsp;&nbsp;
                  {(get(report, "numberOfImportErrors") > 0 ||
                    get(report, "numberOfMappingErrors") > 0) && (
                      <Link
                        to={`/import-reports/errors/${get(report, "id")}`}
                      >
                        <Text danger inline>
                          {translate("importReports.meta.errors")}
                        </Text>
                      </Link>
                    )}
                </>
              ),
            },
          ]}
          manual
          sortable={false}
          onPageSizeChange={(size) => this.search(pageNumber, size)}
          onPageChange={(page) => this.search(page, pageSize)}
          pageSizeOptions={[20, 50, 100, 200, 500]}
          page={pageNumber}
          pages={Math.round(total / pageSize)}
          pageSize={pageSize}
          data={results}
          showPaginationTop={true}
          style={{ backgroundColor: "#FFF" }}
        />
      </SinglePageLayout>
    );
  }
}

export default withRouter(
  withUser(withLocalization(AllImportReports))
);
