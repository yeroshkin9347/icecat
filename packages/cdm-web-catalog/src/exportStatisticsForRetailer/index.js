import React from "react";
import { withRouter } from "react-router-dom";
import fileDownload from "js-file-download";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { Zone, Padding, H1, Text, Row, Col, Button } from "cdm-ui-components";
import { defaultFilters } from "./models";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { paramObject, updateUrl } from "cdm-shared/utils/url";
import {
  exportStatisticsForRetailer,
  getExportStatisticsForRetailer
} from "cdm-shared/services/statistics";
import Table from "cdm-shared/component/Table";
import Filters from "./Filters";
import Banner from "cdm-shared/component/Banner";
import { parseDate, formatDate } from 'cdm-shared/utils/date';
import { CDM_SIMPLE_BANNER_WEB } from "common/environment";
import withUser from "cdm-shared/redux/hoc/withUser";

class ExportStatisticsForRetailer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      total: 0,
      loading: false,
      filters: defaultFilters(props.getCurrentUser()),
      pageNumber: 0,
      pageSize: 50,
      groupByTradeItem: false,
      exportActions: []
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const { filters, pageSize, pageNumber, groupByTradeItem } = this.state;

    const urlFilters = paramObject();
    const f = isEmpty(urlFilters)
      ? filters
      : Object.assign({}, filters, urlFilters);

    this.search(pageNumber, pageSize, f, groupByTradeItem);
  }

  search(pageNumber, pageSize, filters, groupByTradeItem) {
    this.setState({
      loading: true,
      filters,
      groupByTradeItem,
      pageNumber,
      pageSize
    });

    getExportStatisticsForRetailer(pageNumber, pageSize, filters, groupByTradeItem)
      .then(res => {
        updateUrl(filters);
        this.setState({
          loading: false,
          results: get(res, "data.results"),
          total: get(res, "data.total")
        });
      })
      .catch(err => this.setState({ loading: false }));
  }

  export() {
    const { filters, groupByTradeItem } = this.state;

    this.setState({ loading: true });

    exportStatisticsForRetailer(filters, groupByTradeItem)
      .then(res => {
        fileDownload(res.data, `stats_export_${formatDate(new Date(), "YYYYMMDD_HHmm")}.csv`);
        this.setState({ loading: false });
      })
      .catch(err => this.setState({ loading: false }));
  }

  render() {
    const {
      results,
      total,
      loading,
      filters,
      pageNumber,
      pageSize,
      groupByTradeItem,
    } = this.state;
    
    const { translate } = this.props;
    
    return (
      <>
        {/* Header row */}
        <Banner imageUrl={CDM_SIMPLE_BANNER_WEB}>
          <H1 noMargin color="#fff">
            {translate("exportStatistics.meta.title")}
          </H1>
        </Banner>

        {/* Main zone */}
        <Zone transparent noShadow responsive>
          {/* Filters */}
          <Filters
            filters={filters}
            groupByTradeItem={groupByTradeItem}
            onSubmit={(f, group) => this.search(pageNumber, pageSize, f, group)}
          />
          <br />

          {/* Actions */}
          <Row>
            {/* Total */}
            <Col col>
              <Text style={{ lineHeight: 2 }} bold>
                {total} {translate("exportStatistics.search.productsFound")}
              </Text>
            </Col>

            {/* Export */}
            <Col col right>
              {total > 0 && (
                <Button onClick={e => this.export()} primary small noMargin>
                  {translate("exportStatistics.filters.export")}
                </Button>
              )}
            </Col>
          </Row>

          {/* Results */}
          <Padding vertical={3}>
            {/* Datatable */}
            <Table
              columns= {[
                {
                  Header: translate("exportStatistics.table.actionName"),
                  className: "text-left",
                  accessor: "exportPreComputedTradeItemAction.name"
                },
                {
                  Header: translate("exportStatistics.table.gtin"),
                  className: "text-left",
                  accessor: "gtin"
                },
                {
                  Header: translate("exportStatistics.table.manufacturerCode"),
                  className: "text-left",
                  accessor: "tradeItemManufacturerCode"
                },
                {
                  Header: translate("exportStatistics.table.supplier"),
                  className: "text-left",
                  accessor: "manufacturer.name"
                },
                {
                  Header: translate("exportStatistics.table.retailerCode"),
                  className: "text-left",
                  accessor: "retailerCode"
                },
                {
                  Header: translate("exportStatistics.table.title"),
                  className: "text-left",
                  accessor: "title"
                },
                {
                  Header: translate("exportStatistics.table.numberOfImages"),
                  className: "text-center",
                  width: 75,
                  accessor: "numberOfImages"
                },
                {
                  Header: translate("exportStatistics.table.numberOfVideos"),
                  className: "text-center",
                  width: 75,
                  accessor: "numberOfVideos"
                },
                {
                  Header: translate("exportStatistics.table.exportDate"),
                  className: "text-left",
                  id: "exportedTimestamp",
                  accessor: d => parseDate(get(d, "exportedTimestamp"))
                }
              ]}
              loading={loading}
              manual
              sortable={false}
              onPageSizeChange={size =>
                this.search(pageNumber, size, filters, groupByTradeItem)
              }
              onPageChange={page =>
                this.search(page, pageSize, filters, groupByTradeItem)
              }
              pageSizeOptions={[20, 50, 100, 200, 500]}
              page={pageNumber}
              pages={Math.round(total / pageSize)}
              pageSize={pageSize}
              data={results}
              showPaginationTop={true}
            />
          </Padding>
        </Zone>
      </>
    );
  }
}

export default withRouter(
  withUser(withLocalization(ExportStatisticsForRetailer))
);
