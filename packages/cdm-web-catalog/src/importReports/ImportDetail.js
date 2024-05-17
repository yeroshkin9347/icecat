import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import { Box } from "@mui/material";
import { Padding } from "cdm-ui-components";
import { getDateTime } from "cdm-shared/utils/date";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Table from "cdm-shared/component/Table";
import { getImportReports, getImportJob } from "cdm-shared/services/import";
import Link, { DefaultLink } from "cdm-shared/component/Link";
import { getReducedRetailers } from "./utils";
import Status from "./Status";
import { importDetailDefaultFilters } from "./models";
import ImportDetailFilters from "./ImportDetailFilters";
import { updateUrl, paramObject } from "cdm-shared/utils/url";
import { SinglePageLayout } from "styled-components/layout";

class ImportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      total: 0,
      filters: props.filters || importDetailDefaultFilters(),
      loading: false,
      pageNumber: 0,
      pageSize: 30,
      importJob: null,
      importReportsReducedRetailers: [],
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const { pageSize, pageNumber, filters } = this.state;

    const { match } = this.props;

    const id = match.params.id;

    if (!id) return;

    const urlFilters = paramObject();
    const f = isEmpty(urlFilters)
      ? filters
      : Object.assign({}, filters, urlFilters);

    getImportJob(id).then((res) => this.setState({ importJob: res.data }));

    this.search(pageSize, pageNumber, f);
  }

  search(pageSize, pageNumber, filters) {
    const { match } = this.props;

    const id = match.params.id;

    if (!id) return;

    this.setState({ loading: true, pageNumber, pageSize, filters });

    getImportReports(
      pageSize,
      pageNumber,
      id,
      pickBy(filters, (f) => f !== null && f !== "" && f !== undefined)
    )
      .then((res) => {
        this.setState({
          loading: false,
          results: get(res, "data.results"),
          total: get(res, "data.total"),
          importReportsReducedRetailers: getReducedRetailers(
            get(res, "data.results")
          ),
        });
        updateUrl(filters);
      })
      .catch((err) => this.setState({ loading: false }));
  }

  render() {
    const {
      results,
      total,
      loading,
      pageNumber,
      pageSize,
      importReportsReducedRetailers,
      filters,
      importJob,
    } = this.state;

    const { match } = this.props;

    const id = match.params.id;

    const { translate } = this.props;

    return (
      <SinglePageLayout
        title={translate("importReports.meta.title")}
        subtitle={(
          <Box display="flex" alignItems="center">
            {translate("importReports.meta.importOf")}{" "}
            {getDateTime(get(importJob, "startTimestamp", ""))}
            &nbsp;-&nbsp;
            <DefaultLink
              style={{ textDecoration: "underline" }}
              href={get(importJob, "excelFileUrl")}
            >
              {translate("importReports.meta.matrix")}
            </DefaultLink>
          </Box>
        )}
        breadcrumbs={[
          { title: translate("header.nav.home"), route: "/" },
          { title: translate("importReports.links.all"), route: "/import-reports/all" },
          { title: translate("importReports.meta.title") }
        ]}
      >
        {/* Filters */}
        <ImportDetailFilters
          filters={filters}
          onSubmit={(f) => this.search(pageSize, pageNumber, f)}
        />
        <br />

        {/* Results */}
        <Padding vertical={3}>
          {/* Datatable */}
          <Table
            columns={[
              {
                Header: translate("importReports.table.ean"),
                accessor: "tradeItem.gtin",
              },
              {
                Header: translate("importReports.table.ref"),
                accessor: "tradeItem.tradeItemManufacturerCode",
              },
              {
                Header: translate("importReports.table.title"),
                accessor: "tradeItem.title",
              },
              ...map(
                importReportsReducedRetailers,
                (reducedRetailer, kReducedRetailer) => {
                  return {
                    Header: reducedRetailer,
                    id: reducedRetailer,
                    className: "text-center",
                    accessor: (item) => (
                      <Status
                        translate={translate}
                        targetRetailer={reducedRetailer}
                        tradeItemRetailerReports={get(
                          item,
                          "tradeItemRetailerReports",
                          []
                        )}
                      />
                    ),
                  };
                }
              ),
              {
                Header: translate("importReports.table.actions"),
                className: "text-center",
                id: "actions",
                accessor: (item) => (
                  <Link
                    to={`/import-reports/import-trade-item-detail/${item.importJob.importJobId}/${item.tradeItem.tradeItemId}`}
                  >
                    {translate("importReports.meta.viewDetail")}
                  </Link>
                ),
              },
            ]}
            loading={loading}
            manual
            sortable={false}
            onPageSizeChange={(size) =>
              this.search(size, pageNumber, id, filters)
            }
            onPageChange={(page) => this.search(pageSize, page, id, filters)}
            pageSizeOptions={[30, 50, 100, 200, 500]}
            page={pageNumber}
            pages={Math.round(total / pageSize)}
            pageSize={pageSize}
            data={results}
            showPaginationTop={true}
          />
        </Padding>
      </SinglePageLayout>
    );
  }
}

export default withRouter(withLocalization(ImportDetail));
