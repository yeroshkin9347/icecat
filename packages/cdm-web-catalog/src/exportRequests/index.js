import React, { useCallback, useEffect, useMemo, useState } from "react";
import queryString from "query-string";
import { Link, useHistory, useLocation, withRouter } from "react-router-dom";
import { debounce, get, uniq } from "lodash";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import {
  getPagedEnrichmentRequestedTradeItemsForRetailer,
  removeEnrichmentRequestForRetailer,
} from "cdm-shared/services/enrichment";
import { getSendingStatusForRetailer } from "cdm-shared/services/statistics";
import { getRetailerTradeItemsDetail } from "cdm-shared/services/indexers";
import CustomMuiTable from "cdm-shared/component/muiTable/CustomMuiTable";
import { SinglePageLayout } from "styled-components/layout";
import { defaultFilters } from "./models";
import Filters from "./Filters";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import ExportRequestDeleteConfirmation from "./ExportRequestDeleteConfirmation";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export const ExportRequests = ({ currentLocaleCode, translate }) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortModel, setSortModel] = useState({ id: "", desc: false });
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

  const columns = [
    {
      id: "gtin",
      label: translate("exportRequests.table.requestedGtin"),
      className: "text-left",
      sortable: true,
      valueGetter: (row) => row.gtin || row.identity?.gtin?.value,
    },
    {
      id: "mpn",
      label: translate("exportRequests.table.requestedMpn"),
      className: "text-left",
    },
    {
      id: "title",
      label: translate("exportRequests.table.requestedTitle"),
      className: "text-left",
    },
    {
      id: "languageCode",
      label: translate("exportRequests.table.requestedLanguages"),
      className: "text-left",
    },
    {
      id: "creationTimestamp",
      label: translate("exportRequests.table.requestTimestamp"),
      className: "text-left",
      sortable: true,
      dataType: "datetime",
    },
    {
      id: "matched",
      label: translate("exportRequests.table.matchingStatus"),
      className: "text-center",
      dataType: "boolean",
      sortable: true,
      tooltipDescription: (row) =>
        row.matched
          ? translate("exportRequests.filters.matched")
          : translate("exportRequests.filters.notMatched"),
    },
    {
      id: "matchingTimestamp",
      label: translate("exportRequests.table.matchingTimestamp"),
      className: "text-left",
    },
    {
      id: "sent",
      label: translate("exportRequests.table.sendingStatus"),
      className: "text-center",
      dataType: "boolean",
      tooltipDescription: (row) =>
        row.sent
          ? translate("exportRequests.filters.sent")
          : translate("exportRequests.filters.notSent"),
    },
    {
      id: "sentTimestamp",
      label: translate("exportRequests.table.sendingTimestamp"),
      className: "text-left",
      dataType: "datetime",
    },
    {
      id: "actions",
      label: translate("exportRequests.table.actions"),
      className: "text-center",
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton
          color="error"
          size="large"
          aria-label="Remove user"
          sx={{
            padding: 0.5,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedItemToDelete(row);
          }}
        >
          <DeleteIcon fontSize="medium" />
        </IconButton>
      ),
    },
  ];

  const renderExpansionPanel = (row) => (
    <div>
      {row.expandData ? (
        <>
          <div>GTIN: {row.expandData.identities?.[0]?.gtin?.value}</div>
          <div>
            MPN:{" "}
            {row.expandData.identities?.[0]?.tradeItemManufacturerCode || "N/A"}
          </div>
          <div>
            {translate("exportRequests.table.brand")}:{" "}
            {row.expandData.manufacturerName || "N/A"}
          </div>
          <div>
            {translate("exportRequests.table.title")}: {row.expandData.title}
          </div>
          <Link
            target="blank"
            to={`/product/${currentLocaleCode}/${row.expandData.tradeItemId}`}
            className="btn btn-secondary mt-2"
          >
            {translate("exportRequests.table.goToProduct")}
          </Link>
        </>
      ) : (
        translate("exportRequests.table.emptyExpandData")
      )}
    </div>
  );

  const search = useCallback(
    (page, pageSize, filters, sortModel) => {
      setLoading(true);
      const query = {
        pageSize,
        pageNumber: page,
      };
      if (filters.requestedFrom) {
        query.requestedPeriodStartDate = filters.requestedFrom;
      }
      if (filters.requestedTo) {
        query.requestedPeriodEndDate = filters.requestedTo;
      }
      if (filters.requestedGtin) {
        query.gtin = filters.requestedGtin;
      }
      if (filters.matchingStatus) {
        query.matched = filters.matchingStatus;
      }
      if (sortModel && sortModel.id) {
        query.orderBy = sortModel.id;
        query.orderDirection = sortModel.desc ? "Descending" : "Ascending";
      }
      getPagedEnrichmentRequestedTradeItemsForRetailer(query)
        .then(async (res) => {
          const results = get(res, "data.results") || [];
          const tradeItemIds = [];
          results.forEach((row) => {
            if (row.matchedTradeItems?.length) {
              row.matchedTradeItems.forEach((item) => {
                tradeItemIds.push(item.tradeItemId);
              });
            }
          });
          if (tradeItemIds.length) {
            await Promise.all([
              getSendingStatusForRetailer(uniq(tradeItemIds)).then((res) => {
                const data = res.data;
                results.forEach((row) => {
                  if (row.matchedTradeItems?.length) {
                    const tradeItemIds = row.matchedTradeItems.map(
                      (item) => item.tradeItemId
                    );
                    const status = data.find((item) =>
                      tradeItemIds.includes(item.tradeItemId)
                    );
                    if (status) {
                      row.sent = true;
                      row.sentTimestamp = status.exportedTimestamp;
                    }
                  }
                });
              }),
              getRetailerTradeItemsDetail(
                uniq(tradeItemIds),
                currentLocaleCode
              ).then((res) => {
                const data = res.data;
                results.forEach((row) => {
                  if (row.matchedTradeItems?.length) {
                    const tradeItemIds = row.matchedTradeItems.map(
                      (item) => item.tradeItemId
                    );
                    const expandItem = data.find((item) =>
                      tradeItemIds.includes(item.tradeItemId)
                    );
                    if (expandItem) {
                      row.expandData = expandItem;
                    }
                  }
                });
              }),
            ]);
          }
          setResults(results);
          setTotal(get(res, "data.total") || 0);
        })
        .catch((err) => {
          console.log(err);
          setResults([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    },
    [currentLocaleCode]
  );

  const handleRequestSort = useCallback(
    (property) => {
      setSortModel({
        id: property,
        desc: sortModel?.id === property && !sortModel?.desc,
      });
    },
    [sortModel]
  );

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const newPageSize = parseInt(event.target.value, 10);
      const newPage = Math.floor((page * pageSize) / newPageSize);
      setPage(newPage);
      setPageSize(newPageSize);
    },
    [total, page, pageSize]
  );

  const debouncedSearch = useMemo(() => debounce(search, 500), [search]);

  const deleteExportRequest = useCallback(() => {
    if (selectedItemToDelete) {
      removeEnrichmentRequestForRetailer(selectedItemToDelete.id)
        .then(() => {
          setSelectedItemToDelete(null);
          search(page, pageSize, filters, sortModel);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedItemToDelete, search, page, pageSize, filters, sortModel]);

  useEffect(() => {
    setLoading(true);
    debouncedSearch(page, pageSize, filters, sortModel);
  }, [debouncedSearch, page, pageSize, filters, sortModel]);

  useEffect(() => {
    const initialFilters = queryString.parse(location.search);
    if (initialFilters.matchingStatus) {
      initialFilters.matchingStatus = initialFilters.matchingStatus === "true";
    }
    setFilters((prevFilters) => ({ ...prevFilters, ...initialFilters }));
  }, []);

  useEffect(() => {
    const formattedFilters = Object.keys(filters).reduce(
      (prev, key) =>
        (filters[key] ?? "undefined") === "undefined"
          ? prev
          : { ...prev, [key]: filters[key] },
      {}
    );
    const searchQuery = queryString.stringify(formattedFilters);
    history.push({ search: searchQuery });
  }, [filters]);

  return (
    <SinglePageLayout
      title={translate("exportRequests.banner.title")}
      subtitle={translate("exportRequests.banner.subTitle")}
      breadcrumbs={[
        { title: translate("header.nav.home"), route: "/" },
        { title: translate("exportRequests.banner.enrichmentLinkTitle") },
      ]}
    >
      <Filters filters={filters} onChange={setFilters} />
      <br />

      <CustomMuiTable
        columns={columns}
        data={results}
        order={sortModel?.desc ? "desc" : "asc"}
        orderBy={sortModel?.id}
        page={page}
        loading={loading}
        pageSize={pageSize}
        totalCount={total}
        translate={translate}
        renderExpansionPanel={renderExpansionPanel}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        onRequestSort={handleRequestSort}
      />

      {!!selectedItemToDelete && (
        <ModalStyled sm>
          <ExportRequestDeleteConfirmation
            onConfirm={deleteExportRequest}
            onCancel={() => {
              setSelectedItemToDelete(null);
            }}
          />
        </ModalStyled>
      )}
    </SinglePageLayout>
  );
};

export default withRouter(withUser(withLocalization(ExportRequests)));
