import React, { useReducer, useState, useCallback, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {
  Row,
  Col,
  Tooltip,
  Margin,
  Text,
  Loader,
} from "cdm-ui-components";
import {
  paginatedFilterableDataUrlReducer,
  getFilteredTableInitialState,
} from "cdm-shared/reducer/paginatedFilterableDataReducer";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { manufacturerDefaultFilters } from "./reducer";
import Table from "cdm-shared/component/Table";
import {getPagedEligibilityNetworkForManufacturer} from 'cdm-shared/services/tradeItemEligibilityNetwork';
import ManufacturerEligibilityNetworkFilters from "./ManufacturerEligibilityNetworkFilters";
import { PrimaryLink } from "cdm-shared/component/Link";
import withUser, { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { paramObject } from "cdm-shared/utils/url";
import TradeItemEligibilityStatus from "./TradeItemEligibilityStatus";
import ManufacturerEligibilityNetwordActions from "./ManufacturerEligibilityNetworkActions";
import { SinglePageLayout } from "styled-components/layout";
import { IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { DARK } from "cdm-shared/component/color";

function ManufacturerEligibilityNetwork({
  currentLocaleCode,
  user,
  match,
  translate,
}) {
  // initialise state
  const [searchState, dispatch] = useReducer(
    paginatedFilterableDataUrlReducer,
    getFilteredTableInitialState(manufacturerDefaultFilters)
  );
  const [manufacturerId, setManufacturerId] = useState(null);
  const [init, setInit] = useState(false);

  // memoized functions
  const search = useCallback(() => {
    dispatch({ type: "setLoading", value: true });
    getPagedEligibilityNetworkForManufacturer(
      searchState.pageNumber,
      searchState.pageSize,
      searchState.filters
    )
      .then((res) => {
        dispatch({ type: "setLoading", value: false });
        dispatch({
          type: "setResults",
          results: get(res, "data.results"),
          total: get(res, "data.total"),
        });
      })
      .catch(() => dispatch({ type: "setLoading", value: false }));
  }, [searchState.pageNumber, searchState.pageSize, searchState.filters]);

  // search updates
  useEffect(() => {
    init && search();
  }, [search, init]);

  // on mount get filters from url
  useEffect(() => {
    const urlFilters = paramObject();
    if (!isEmpty(urlFilters)) {
      dispatch({ type: "setFilters", value: urlFilters });
    }
    setInit(true);
  }, []);

  // set manufacturer id
  useEffect(() => setManufacturerId(getManufacturerId(user)), [user]);

  return (
    <SinglePageLayout
      title={translate("tradeItemEligibility.list.title")}
      subtitle={translate("tradeItemEligibility.list.subtitle")}
      breadcrumbs={[
        { title: translate("header.nav.home"), route: "/" },
        { title: translate("tradeItemEligibility.list.title") }
      ]}
    >
      {/* Filters */}
      <Row>
        <Col col>
          <ManufacturerEligibilityNetworkFilters
            filters={searchState.filters}
            manufacturerId={manufacturerId}
            translate={translate}
            dispatch={dispatch}
          />
          <Margin bottom={3} />
        </Col>
      </Row>

      <Row>
        {/* Totals */}
        <Col col={10}>
          <br />
          {!searchState.loading && (
            <Text small italic>
              {translate("tradeItemEligibility.list.total", {
                total: searchState.total,
              })}
            </Text>
          )}
          {searchState.loading && <Loader small />}
        </Col>

        {/* Export */}
        <Col col={2} right>
          <ManufacturerEligibilityNetwordActions
            translate={translate}
            dispatch={dispatch}
            filters={searchState.filters}
          />
        </Col>
      </Row>

      <Margin bottom={3} />

      {/* Datatable */}
      <Row>
        <Col col>
          <Table
            columns={[
              {
                Header: translate(
                  "tradeItemEligibility.common.tradeItemEligibilityStatus"
                ),
                id: "tradeItemEligibilityStatus",
                className: "text-center",
                accessor: (t) => (
                  <TradeItemEligibilityStatus
                    tradeItemEligibility={t}
                    onClick={(e) =>
                      dispatch({
                        type: "setFilter",
                        key: "tradeItemEligibilityStatus",
                        value: [get(t, "tradeItemEligibilityStatus")],
                      })
                    }
                    translate={translate}
                  />
                ),
              },
              {
                Header: translate("tradeItemEligibility.common.retailerId"),
                accessor: "exportAction.retailer.name",
                className: "text-center",
              },
              {
                Header: translate(
                  "tradeItemEligibility.common.exportActionId"
                ),
                accessor: "exportAction.name",
                className: "text-center",
              },
              {
                Header: translate("tradeItemEligibility.common.gtin"),
                accessor: "tradeItem.identity.gtin.value",
                className: "text-center",
              },
              {
                Header: translate(
                  "tradeItemEligibility.common.tradeItemManufacturerCode"
                ),
                accessor: "tradeItem.identity.tradeItemManufacturerCode",
                className: "text-center",
              },
              {
                Header: translate(
                  "tradeItemEligibility.common.tradeItemId"
                ),
                id: "tradeItem.tradeItemId",
                className: "text-center",
                accessor: (t) => (
                  <PrimaryLink
                    target="__blank"
                    to={`/product/${currentLocaleCode}/${get(
                      t,
                      "tradeItem.id"
                    )}`}
                  >
                    {get(t, "tradeItem.title")}
                  </PrimaryLink>
                ),
              },
              {
                Header: translate("tradeItemEligibility.list.actions"),
                id: "actions",
                className: "text-center",
                fixed: "right",
                width: 100,
                accessor: (t) => (
                  <Tooltip
                    interactive
                    placement="left"
                    html={translate("tradeItemEligibility.list.viewDetail")}
                  >
                    <Link to={`/network-status-item/${t.id}`}>
                      <IconButton
                        color="inherit"
                        size="large"
                        sx={{
                          padding: 0.5,
                          marginRight: 1,
                        }}
                      >
                        <Visibility fontSize="inherit" sx={{ color: DARK }}/>
                      </IconButton>
                    </Link>
                  </Tooltip>
                ),
              },
            ]}
            manual
            loading={searchState.loading}
            sortable={false}
            onPageSizeChange={(size) =>
              dispatch({ type: "setPageSize", value: size })
            }
            onPageChange={(page) =>
              dispatch({ type: "setPageNumber", value: page })
            }
            pageSizeOptions={[20, 50, 100]}
            page={searchState.pageNumber}
            pages={Math.ceil(searchState.total / searchState.pageSize)}
            pageSize={searchState.pageSize}
            data={searchState.results}
            showPaginationTop={true}
            showPaginationBottom={false}
          />
        </Col>
      </Row>
    </SinglePageLayout>
  );
}

export default withUser(
  withRouter(
    withLocalization(ManufacturerEligibilityNetwork)
  )
);
