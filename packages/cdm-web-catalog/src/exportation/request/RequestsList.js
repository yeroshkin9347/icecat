import React, { useEffect, useReducer, useState, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import { getPagedEnrichmentRequestsForRetailer } from "cdm-shared/services/enrichmentRequest";
import paginatedFilterableDataReducer, {
  getFilteredTableInitialState
} from "cdm-shared/reducer/paginatedFilterableDataReducer";
import { enrichmentRequestDefaultFilters } from "./reducer";
import { parseDate } from "cdm-shared/utils/date";
import Table from "cdm-shared/component/Table";
import {
  RoundedButton,
  Icon,
  Tag,
  Margin,
  Loader,
  Tooltip
} from "cdm-ui-components";
import { ic_visibility } from "react-icons-kit/md/ic_visibility";
import { ic_search } from "react-icons-kit/md/ic_search";
import RequestDetail from "./RequestDetail";
import RequestTotals from "./RequestTotals";
import RequestFilters from "./RequestFilters";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";

function RequestsList({ currentLocaleCode, translate }, ref) {
  // initialise state
  const [searchState, dispatch] = useReducer(
    paginatedFilterableDataReducer,
    getFilteredTableInitialState(enrichmentRequestDefaultFilters)
  );
  const [
    selectedEnrichmentRequestId,
    setSelectedEnrichmentRequestId
  ] = useState(null);
  const [selectedEnrichmentRequest, setSelectedEnrichmentRequest] = useState(
    null
  );

  // memoized search function
  const search = useCallback(() => {
    dispatch({ type: "setLoading", value: false });
    getPagedEnrichmentRequestsForRetailer(
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
  }, [searchState.pageNumber, searchState.pageSize, searchState.filters]);

  // search updates
  useEffect(() => {
    search();
  }, [search]);

  // refresh interval
  useEffect(() => {
		let refreshInterval;
    if (searchState.loading) return;
    if (searchState.results.length) {
      const hasPendingJobs = find(
        searchState.results,
        r => get(r, "enrichmentStatus") !== "Complete"
      );
      if (hasPendingJobs) {
        refreshInterval = setInterval(() => search(), 10000);
      }
    }
    return () => {
      refreshInterval && clearInterval(refreshInterval);
    };
  }, [search, searchState.results, searchState.loading]);

  return (
    <>
      {/* Filters */}
      <RequestFilters
        filters={searchState.filters}
        dispatch={dispatch}
        translate={translate}
        refreshRef={ref}
      />

      <Margin vertical={2}>
        {searchState.loading && <Loader small />}&nbsp;
      </Margin>

      {/* Datatable */}
      <Table
        columns={[
          {
            Header: translate("export.requests.enrichmentStatus"),
            id: "status",
            className: "text-center",
            accessor: request => (
              <Tag
                onClick={e =>
                  dispatch({
                    type: "setFilter",
                    key: "enrichmentStatus",
                    value: get(request, "enrichmentStatus")
                  })
                }
                noMargin
                success={get(request, "enrichmentStatus") === "Complete"}
                light={get(request, "enrichmentStatus") !== "Complete"}
              >
                {translate(`export.enum.${get(request, "enrichmentStatus")}`)}
              </Tag>
            )
          },
          {
            Header: translate("export.requests.creationTimestamp"),
            id: "creationTimestamp",
            className: "text-center",
            accessor: request => parseDate(get(request, "creationTimestamp"))
          },
          {
            Header: translate("export.requests.userName"),
            accessor: "userName",
            className: "text-center"
          },
          {
            Header: translate("export.requests.analysisStatus"),
            id: "analysisStatus",
            className: "text-center",
            accessor: request => (
              <Tag
                onClick={e =>
                  dispatch({
                    type: "setFilter",
                    key: "analysisStatus",
                    value: [get(request, "analysisStatus")]
                  })
                }
                noMargin
                success={get(request, "analysisStatus") === "Analysed"}
                danger={get(request, "analysisStatus") === "AnalysisFailed"}
                info={get(request, "analysisStatus") !== "AnalysisFailed"}
              >
                {translate(`export.enum.${get(request, "analysisStatus")}`)}
              </Tag>
            )
          },
          {
            Header: translate("export.requests.totalRequestedTradeItems"),
            accessor: "totalRequestedTradeItems",
            className: "text-center"
          },
          {
            Header: translate("export.requests.totalMatchedTradeItems"),
            accessor: "totalMatchedTradeItems",
            className: "text-center"
          },
          {
            Header: translate("export.requests.actions"),
            id: "actions",
            className: "text-center",
            fixed: "right",
            accessor: request => (
              <>
                <Tooltip
                  interactive
                  html={translate("export.requests.viewDetail")}
                >
                  <RoundedButton
                    onClick={e =>
                      setSelectedEnrichmentRequestId(get(request, "id"))
                    }
                    secondary
                    small
                  >
                    <Icon icon={ic_visibility} size={12} />
                  </RoundedButton>
                </Tooltip>

                <Tooltip
                  interactive
                  placement="right"
                  html={translate("export.requests.viewTotal")}
                >
                  <RoundedButton
                    onClick={e => setSelectedEnrichmentRequest(request)}
                    noMargin
                    primary
                    small
                  >
                    <Icon icon={ic_search} size={12} />
                  </RoundedButton>
                </Tooltip>
              </>
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

      {selectedEnrichmentRequestId && (
        <ModalStyled onClose={() => setSelectedEnrichmentRequestId(null)}>
          <RequestDetail
            id={selectedEnrichmentRequestId}
            translate={translate}
            currentLocaleCode={currentLocaleCode}
          />
        </ModalStyled>
      )}

      {selectedEnrichmentRequest && (
        <ModalStyled sm onClose={() => setSelectedEnrichmentRequest(null)}>
          <RequestTotals
            enrichmentRequest={selectedEnrichmentRequest}
            translate={translate}
          />
        </ModalStyled>
      )}
    </>
  );
}

export default React.forwardRef(RequestsList);
