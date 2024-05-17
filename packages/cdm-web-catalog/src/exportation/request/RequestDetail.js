import React, { useReducer, useEffect } from "react";
import get from "lodash/get";
import { enrichmentRequestDetailDefaultFilters } from "./reducer";
import paginatedFilterableDataReducer, {
  getFilteredTableInitialState
} from "cdm-shared/reducer/paginatedFilterableDataReducer";
import { getPagedEnrichmentRequestDetailForRetailer } from "cdm-shared/services/enrichmentRequest";
import Table from "cdm-shared/component/Table";
import { Tag, Margin, H3, Loader, Row, Col, Text } from "cdm-ui-components";
import RequestDetailFilters from "./RequestDetailFilters";
import { PrimaryLink } from "cdm-shared/component/Link";

const RequestDetail = ({
  id,
  currentLocaleCode,
  // functions
  translate
}) => {
  // initialise state
  const [searchState, dispatch] = useReducer(
    paginatedFilterableDataReducer,
    getFilteredTableInitialState(enrichmentRequestDetailDefaultFilters)
  );

  // search updates
  useEffect(() => {
    dispatch({ type: "setLoading", value: false });
    getPagedEnrichmentRequestDetailForRetailer(
      id,
      searchState.pageNumber,
      searchState.pageSize,
      searchState.filters
    )
      .then(res => {
        dispatch({ type: "setLoading", value: false });
        dispatch({
          type: "setResults",
          results: get(res, "data.results"),
          total: get(res, "data.total")
        });
      })
      .catch(() => dispatch({ type: "setLoading", value: false }));
  }, [id, searchState.pageNumber, searchState.pageSize, searchState.filters]);

  // {
  //     Header: translate('export.requestdetail.exportStatus'),
  //     id: 'exportStatus',
  //     className: 'text-center',
  //     accessor: request => (
  //         <Tag
  //             onClick={e => dispatch({ type: 'setFilter', key: 'exportStatus', value: get(request, 'exportStatus')})}
  //             noMargin
  //             success={get(request, 'exportStatus') === 'Exported'}
  //             danger={get(request, 'exportStatus') !== 'Exported'}
  //             >
  //             {translate(`export.enum.${get(request, 'exportStatus')}`)}
  //             </Tag>
  //     )
  // },

  return (
    <>
      <Row>
        <Col col={9}>
          <H3>{translate("export.requestdetail.title")} </H3>
        </Col>
        <Col col={3} right>
          {searchState.loading && <Loader />}
        </Col>
      </Row>

      <Margin bottom={5} />

      {/* Filters */}
      <RequestDetailFilters
        filters={searchState.filters}
        dispatch={dispatch}
        translate={translate}
      />

      <Margin bottom={4} />

      {/* Datatable */}
      <Table
        columns={[
          {
            Header: translate("export.requestdetail.matchingStatus"),
            id: "matchingStatus",
            className: "text-center",
            accessor: request => (
              <Tag
                onClick={e =>
                  dispatch({
                    type: "setFilter",
                    key: "matchingStatus",
                    value: [get(request, "matchingStatus")]
                  })
                }
                noMargin
                success={get(request, "matchingStatus") === "Complete"}
                danger={get(request, "matchingStatus") !== "Complete"}
              >
                {translate(`export.enum.${get(request, "matchingStatus")}`)}
              </Tag>
            )
          },
          {
            Header: translate("export.requestdetail.gtin"),
            accessor: "gtin",
            className: "text-center"
          },
          {
            Header: translate("export.requestdetail.manufacturerReference"),
            accessor: "manufacturerReference",
            className: "text-center"
          },
          {
            Header: translate("export.requestdetail.manufacturerName"),
            id: "manufacturerName",
            className: "text-center",
            accessor: request =>
              get(request, "manufacturerName") || (
                <Text italic>
                  {translate("export.requestdetail.manufacturerNotExisting")}
                </Text>
              )
          },
          {
            Header: translate("export.requestdetail.actions"),
            id: "actions",
            className: "text-center",
            fixed: "right",
            accessor: request =>
              get(request, "tradeItemId") && (
                <PrimaryLink
                  to={`/product/${currentLocaleCode}/${request.tradeItemId}`}
                  target="_blank"
                >
                  {translate(`export.requestdetail.viewProduct`)}
                </PrimaryLink>
              )
          }
        ]}
        manual
        sortable={false}
        onPageSizeChange={size =>
          dispatch({ type: "setPageSize", value: size })
        }
        onPageChange={page => dispatch({ type: "setPageNumber", value: page })}
        pageSizeOptions={[20]}
        page={searchState.pageNumber}
        pages={Math.ceil(searchState.total / searchState.pageSize)}
        pageSize={searchState.pageSize}
        data={searchState.results}
        showPaginationTop={true}
        showPaginationBottom={false}
      />
    </>
  );
};

export default RequestDetail;
