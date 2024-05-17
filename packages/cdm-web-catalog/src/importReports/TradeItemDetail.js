import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import { Box } from "@mui/material";
import { Padding, P } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getDateTime } from "cdm-shared/utils/date";
import Table from "cdm-shared/component/Table";
import { getTradeItemDetail, getImportJob } from "cdm-shared/services/import";
import { DefaultLink } from "cdm-shared/component/Link";
import { getReducedRetailers } from "./utils";
import Status from "./Status";
import { importTradeItemStatusDefaultFilters } from "./models";
import TradeItemDetailFilters from "./TradeItemDetailFilters";
import { updateUrl, paramObject } from "cdm-shared/utils/url";
import { SinglePageLayout } from "styled-components/layout";

class TradeItemDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      total: 0,
      filters: props.filters || importTradeItemStatusDefaultFilters(),
      loading: false,
      pageNumber: 0,
      pageSize: 30,
      importJob: null,
      reducedRetailers: [],
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const { pageSize, pageNumber, filters } = this.state;

    const { match } = this.props;

    const importId = match.params.importId;

    if (!importId) return;

    const urlFilters = paramObject();
    const f = isEmpty(urlFilters)
      ? filters
      : Object.assign({}, filters, urlFilters);

    getImportJob(importId).then((res) =>
      this.setState({ importJob: res.data })
    );

    this.search(pageSize, pageNumber, f);
  }

  search(pageSize, pageNumber, filters) {
    const { match } = this.props;

    const importId = match.params.importId;
    const id = match.params.id;

    if (!id) return;

    this.setState({ loading: true, pageNumber, pageSize, filters });

    getTradeItemDetail(
      pageSize,
      pageNumber,
      importId,
      id,
      pickBy(filters, (f) => f !== null && f !== "" && f !== undefined)
    )
      .then((res) => {
        this.setState({
          loading: false,
          results: get(res, "data.results"),
          total: get(res, "data.total"),
          reducedRetailers: getReducedRetailers(get(res, "data.results")),
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
      reducedRetailers,
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
          { title: translate("importReports.links.import") }
        ]}
      >
        {/* Trade item  */}
        {get(results, "[0].tradeItem") && (
          <>
            <P style={{ fontWeight: "bold" }}>
              {`${get(results, "[0].tradeItem.gtin")}`}&nbsp;-&nbsp;
              {`${get(results, "[0].tradeItem.tradeItemManufacturerCode")}`}
              &nbsp;-&nbsp;
              {`${get(results, "[0].tradeItem.title")}`}&nbsp;-&nbsp;
            </P>
            <br />
          </>
        )}

        {/* Filters */}
        <TradeItemDetailFilters
          importJob={importJob}
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
                Header: translate("importReports.filters.group"),
                id: "tradeItemProperty.group",
                accessor: (item) =>
                  translate(`${get(item, "tradeItemProperty.group")}`),
              },
              {
                Header: translate("importReports.table.property"),
                id: "tradeItemProperty.property",
                accessor: (item) =>
                  translate(
                    `tradeItemProperties.properties.${get(
                      item,
                      "tradeItemProperty.propertyCode"
                    )}`
                  ),
              },
              {
                Header: translate("importReports.table.propertyCode"),
                id: "tradeItemProperty.propertyCode",
                className: "text-center",
                accessor: (item) =>
                  get(item, "tradeItemProperty.propertyCode"),
              },
              ...map(
                reducedRetailers,
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

export default withRouter(
  withLocalization(TradeItemDetail)
);
