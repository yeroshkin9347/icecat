import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import concat from "lodash/concat";
import uniq from "lodash/uniq";
import isEmpty from "lodash/isEmpty";
import join from "lodash/join";
import filter from "lodash/filter";
import {
  Loader,
  H3,
  Timeline,
  Button,
  Margin,
  P,
  Row,
  Col,
  Padding,
} from "cdm-ui-components";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { date } from "cdm-shared/utils/date";
import { withLocalization } from "common/redux/hoc/withLocalization";
// import PricingRawData from './pricing/PricingRawData'
import PriceInfo from "./pricing/PricingInfo";
import { getTargetMarkets } from "cdm-shared/services/targetMarket";
import withTank from "cdm-shared/redux/hoc/withTank";
import { getRetailersByIds } from "cdm-shared/services/retailer";
import { formatDate, formatPrice } from "cdm-shared/utils/format";
import { ButtonGroup, IconButton, Tooltip, Box } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import moment from "moment";
import { size } from "lodash";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { CdmDataGrid } from "cdm-shared/component/styled/datagrid";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";
import withUser from "cdm-shared/redux/hoc/withUser";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";
import { filterCatalogPricesForRetailer } from "./utils";

const renderPriceValue = (o, targetMarkets) => {
  const catalog_price_without_tax = get(o, "catalog_price_without_tax", 0);

  if (!catalog_price_without_tax) return "-";

  const price = formatPrice(
    catalog_price_without_tax,
    get(o, "currency_code.key", null)
  );

  if (isEmpty(get(o, "targetMarketIds", null))) return price;

  return `${price} (${join(
    map(get(o, "targetMarketIds", null), (i) => get(targetMarkets, i)),
    ", "
  )})`;
};

const TimelineTooltipValues = ({ keyedItems, targetMarkets, theme }) =>
  map(keyedItems, (items, key) => (
    <p key={`tooltip-values-tooltip-${key}`}>
      {key}:{" "}
      {map(items, (item, kk) => (
        <kbd
          key={`tooltip-value-tooltip-${key}-${kk}`}
          style={{
            // backgroundColor: item.consistencyStatus === 'NotConsistent' ? `rgb(${get(theme, 'color.red', '210, 35, 77')})` : `rgb(${get(theme, 'color.primary', '38,135,255')})`,
            backgroundColor: `rgb(${get(
              theme,
              "color.primary",
              "38,135,255"
            )})`,
            color: "#fff",
            marginRight: ".6em",
            borderRadius: "5px",
            padding: "0 .4em",
          }}
        >
          {renderPriceValue(item, targetMarkets)}
        </kbd>
      ))}
    </p>
  ));

class Pricing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      loading: false,
      retailerIds: [],
      selectedPrice: null,
      periodStart: date().subtract(1, "month").format("YYYY-MM-DD"),
      periodEnd: date().add(1, "month").format("YYYY-MM-DD"),
      targetMarkets: [],
      retailersById: {},
      pricingViewMode: "list",
      pricingShowPastPrices: false,
    };

    this.getTargetMarkets = this.getTargetMarkets.bind(this);
    this.getRetailers = this.getRetailers.bind(this);
  }

  // retrieve
  componentDidUpdate(prevProps) {
    const { tradeItem } = this.props;

    if (
      (get(tradeItem, "tradeItemId") &&
        get(prevProps, "tradeItem.tradeItemId") !==
          get(tradeItem, "tradeItemId")) ||
      get(prevProps, "tradeItem.catalogPrices") !==
        get(tradeItem, "catalogPrices")
    ) {
      this.setState({ loading: true });
      this.preparePricingRawData(tradeItem);
      this.setState({ loading: false });
    }
  }

  getTargetMarkets(targetMarketIds) {
    if (isEmpty(targetMarketIds)) return;
    getTargetMarkets().then((res) =>
      this.setState({
        targetMarkets: reduce(
          res.data,
          (result, value, key) => {
            result[get(value, "id")] = get(value, "name");
            return result;
          },
          {}
        ),
      })
    );
  }

  getRetailers(retailerIds) {
    if (isEmpty(retailerIds)) return;
    getRetailersByIds(retailerIds).then((res) => {
      this.setState({
        retailersById: reduce(
          res.data,
          (result, value, key) => {
            result[get(value, "id")] = get(value, "name");
            return result;
          },
          {}
        ),
      });
    });
  }

  buildPriceInfo(catalogPrice) {
    const priceInfo = {
      ...get(catalogPrice, "values", {}),
      targetMarketIds: get(catalogPrice, "channels[0].targetMarketIds", []),
      startDate: get(catalogPrice, "channels[0].startDate", null),
      endDate: get(catalogPrice, "channels[0].endDate", null),
    };
    return {
      ...priceInfo,
    };
  }

  preparePricingRawData(tradeItem) {
    if (tradeItem === null || tradeItem.catalogPrices === null) return null;

    let targetMarkets = [];

    const res = reduce(
      tradeItem.catalogPrices,
      (result, value, key) => {
        const priceInfo = Object.assign({}, get(value, "values"), {
          consistencyStatus: get(value, "consistencyStatus", null),
        });

        map(get(value, "channels", []), (p, k) => {
          targetMarkets = concat(targetMarkets, get(p, "targetMarketIds", []));
          const retailers = get(p, "retailerIds", []);

          // no retailer => global
          if (isEmpty(retailers)) {
            if (!get(result, "Global")) result.Global = [];
            result.Global.push(
              Object.assign({}, priceInfo, {
                startDate: get(p, "startDate", null),
                endDate: get(p, "endDate", null),
                targetMarketIds: get(p, "targetMarketIds", []),
                retailerId: null,
              })
            );
          }
          // at least one retailer => channel managed
          else {
            map(retailers, (retailerId, i) => {
              if (!get(result, retailerId)) result[retailerId] = [];
              result[retailerId].push(
                Object.assign({}, priceInfo, {
                  startDate: get(p, "startDate", null),
                  endDate: get(p, "endDate", null),
                  targetMarketIds: get(p, "targetMarketIds", []),
                  retailerId,
                })
              );
            });
          }
        });

        return result;
      },
      {}
    );

    const retailerIds = Object.keys(res);

    // getting external resources
    this.getTargetMarkets(uniq(targetMarkets));
    this.getRetailers(filter(retailerIds, (o) => o !== "Global"));

    // set the final state
    this.setState({
      result: res,
      retailerIds: retailerIds,
    });
  }

  render() {
    const {
      result,
      loading,
      targetMarkets,
      periodStart,
      periodEnd,
      selectedPrice,
      retailersById,
      pricingShowPastPrices,
    } = this.state;

    const { tradeItem, theme, currentParsedLocaleCode, user } = this.props;
    const catalogPrices = tradeItem ? tradeItem.catalogPrices || [] : [];

    const catalogPricesTableDataMapData = catalogPrices.map((item, index) => {
      const retailerIds = get(item, "channels[0].retailerIds", []);
      const retailerNames = isEmpty(retailerIds)
        ? "Global"
        : retailerIds
            .map((retailerId) => get(retailersById, retailerId, ""))
            .join(", ");
      const priceInfo = {
        ...get(item, "values", {}),
        targetMarketIds: get(item, "channels[0].targetMarketIds", []),
      };
      return {
        id: index,
        startDate: get(item, "channels[0].startDate", ""),
        endDate: get(item, "channels[0].endDate", ""),
        retailerIds: get(item, "channels[0].retailerIds", []),
        retailerNames: retailerNames,
        catalog_price_without_tax: renderPriceValue(priceInfo, targetMarkets),
      };
    });

    let catalogPricesTableData = [...catalogPricesTableDataMapData];

    if (isRetailer(user)) {
      catalogPricesTableData = filterCatalogPricesForRetailer(
        catalogPricesTableDataMapData
      );
    }

    const displayCatalogPricesTableData = catalogPricesTableData
      .filter((item) => {
        if (pricingShowPastPrices) return true;
        return !item.endDate || moment(item.endDate).isSameOrAfter(moment());
      })
      .sort((a, b) => {
        return moment(b.startDate).diff(moment(a.startDate));
      });

    const showPastPricesButton =
      size(displayCatalogPricesTableData) !== size(catalogPricesTableData);

    const { translate } = this.props;

    if (!tradeItem) return <React.Fragment />;

    // getLineStyle={(item, key) => {
    //     if(item.consistencyStatus === 'NotConsistent') return { backgroundColor: `rgb(${get(theme, 'color.red', '210, 35, 77')})` }
    //     else return { backgroundColor: `rgb(${get(theme, 'color.primary', '38,135,255')})` }
    // }}

    const columns = [
      ...(isRetailer(user)
        ? []
        : [
            {
              headerName: translate("tradeitem.pricing.columns.retailers"),
              field: "retailerNames",
              flex: 1,
              sortable: false,
            },
          ]),
      {
        headerName: translate("tradeitem.pricing.columns.period"),
        field: "period",
        flex: 1,
        valueGetter: (params) => {
          return `${formatDate(params.row.startDate)} - ${formatDate(
            params.row.endDate
          )}`;
        },
        sortable: false,
      },
      {
        headerName: translate("tradeitem.pricing.columns.catalogPrice"),
        field: "catalog_price_without_tax",
        flex: 1,
        sortable: false,
      },
      {
        headerName: translate("tradeitem.pricing.columns.action"),
        field: "actions",
        sortable: false,
        sortingOrder: false,
        renderHeader: (params) => (
          <span
            style={{ paddingLeft: 20 }}
            className="MuiDataGrid-columnHeaderTitle"
          >
            {translate("tradeitem.pricing.columns.action")}
          </span>
        ),
        renderCell: (params) => {
          return (
            <Box px={2}>
              <Tooltip
                arrow
                enterDelay={0}
                leaveDelay={0}
                placement="left"
                title={translate("tradeitem.pricing.columns.view")}
              >
                <IconButton
                  color="primary"
                  size="large"
                  aria-label={translate("tradeitem.pricing.columns.view")}
                  sx={{
                    padding: 0.5,
                  }}
                  onClick={() => {
                    this.setState({
                      selectedPrice: this.buildPriceInfo(
                        catalogPrices[params.row.id]
                      ),
                    });
                  }}
                >
                  <InfoIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ];

    return (
      <>
        <ZoneStyled
          style={{
            minWidth: "50%",
            minHeight: "300px",
            maxWidth: "1500px",
            margin: "0 auto",
          }}
          responsive
          borderRadius
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <H3 id="pricing">{translate("tradeitem.pricing.title")}</H3>
            {!isEmpty(result) && (
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Button
                  small
                  primary={this.state.pricingViewMode === "list"}
                  onClick={() => this.setState({ pricingViewMode: "list" })}
                >
                  List
                </Button>
                <Button
                  small
                  primary={this.state.pricingViewMode === "timeline"}
                  onClick={() => this.setState({ pricingViewMode: "timeline" })}
                >
                  Timeline
                </Button>
              </ButtonGroup>
            )}
          </div>

          {isEmpty(result) && (
            <P lead>{translate("tradeitem.pricing.noPrice")}</P>
          )}

          {!isEmpty(result) && this.state.pricingViewMode === "list" && (
            <>
              <CdmDataGrid
                rows={displayCatalogPricesTableData}
                columns={columns}
                pagination={false}
                hideFooter
                disableColumnMenu
              />
              {showPastPricesButton && (
                <Row>
                  <Col center col>
                    <Padding bottom={3} />
                    <Button
                      onClick={(e) =>
                        this.setState({
                          pricingShowPastPrices: !pricingShowPastPrices,
                        })
                      }
                      small
                      secondary
                    >
                      {translate("tradeitem.pricing.showPastPrices")}
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )}

          {!isEmpty(result) && this.state.pricingViewMode === "timeline" && (
            <>
              <Button
                onClick={(e) =>
                  this.setState({
                    periodStart: date().startOf("month"),
                    periodEnd: date().endOf("month"),
                  })
                }
                small
                secondary
              >
                {translate("tradeitem.pricing.thismonth")}
              </Button>

              <Button
                onClick={(e) =>
                  this.setState({
                    periodStart: date().startOf("year"),
                    periodEnd: date().endOf("year"),
                  })
                }
                small
                secondary
              >
                {translate("tradeitem.pricing.thisyear")}
              </Button>

              <Button
                onClick={(e) =>
                  this.setState({
                    periodStart: date().add(1, "year").startOf("year"),
                    periodEnd: date().add(1, "year").endOf("year"),
                  })
                }
                small
                secondary
                noMargin
              >
                {translate("tradeitem.pricing.nextyear")}
              </Button>

              <Margin bottom={5} />

              {loading && <Loader />}

              {/* Pricing timeline */}
              {!loading && result && (
                <Timeline
                  name="pricing"
                  periodStart={periodStart}
                  periodEnd={periodEnd}
                  onPeriodChanged={(periodStart, periodEnd) =>
                    this.setState({
                      periodStart,
                      periodEnd,
                    })
                  }
                  showTimeWatcher={true}
                  locale={currentParsedLocaleCode}
                  getDataStartDate={(o) => o.startDate}
                  getDataEndDate={(o) => o.endDate}
                  getDataValue={(o) => renderPriceValue(o, targetMarkets)}
                  getLineStyle={(item, key) => {
                    return {
                      backgroundColor: `rgb(${get(
                        theme,
                        "color.primary",
                        "38,135,255"
                      )})`,
                    };
                  }}
                  renderTooltipValues={(keyedItems) => {
                    return (
                      <TimelineTooltipValues
                        keyedItems={keyedItems}
                        targetMarkets={targetMarkets}
                        theme={theme}
                      />
                    );
                  }}
                  onSelect={(item, key) =>
                    this.setState({ selectedPrice: item })
                  }
                  data={result}
                  keys={retailersById}
                />
              )}
            </>
          )}
        </ZoneStyled>

        {selectedPrice && (
          <ModalStyled
            sm
            onClose={() => this.setState({ selectedPrice: null })}
          >
            <PriceInfo
              price={selectedPrice}
              targetMarkets={targetMarkets}
              translate={translate}
            />
          </ModalStyled>
        )}

        <Margin bottom={6} />
      </>
    );
  }
}

export default withUser(withLocalization(withTheme(withTank(Pricing))));
