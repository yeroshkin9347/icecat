import React, { useCallback, useEffect, useMemo, useState } from "react";
import join from "lodash/join";
import get from "lodash/get";
import usePaginatedData from "cdm-shared/hook/usePaginatedData";
import VideoRatingImage from "cdm-shared/component/video/VideoRatingImage/VideoRatingImage";
import { searchVideosCms } from "cdm-shared/services/videos";
import { Margin, Zone, Row, Col, Text, Padding } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import VideosFilters from "./VideosFilters";
import { useHistory, useLocation } from "react-router-dom";
import {
  paramObject,
  parseQueryStringToObject,
  updateUrl,
} from "cdm-shared/utils/url";
import { getRetailerByIdCms } from "cdm-shared/services/retailer";
import { map, toNumber, uniq } from "lodash";
import Flag from "cdm-shared/component/Flag";
import { CdmDataGrid } from "cdm-shared/component/styled/datagrid";

import { IconButton } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import moment from "moment";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SEARCH_AFTER = null;
const DEFAULT_FILTERS = {};
const DEFAULT_PAGE_OPTIONS = [20, 30];

function Videos({ translate }) {
  const [videos, searchVideos] = usePaginatedData({
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: DEFAULT_SEARCH_AFTER,
  });

  const [filters, setFilters] = useState(paramObject() || DEFAULT_FILTERS);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: DEFAULT_PAGE_SIZE,
    page: 0,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [censorOptions, setCensorOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);

  const history = useHistory();
  const location = useLocation();

  const search = useCallback(
    (pageNumber, pageSize, filters = {}) => {
      const formattedFilters = {
        freeText: filters.title,
        fileName: filters.fileName,
        retailerId: filters.retailerId,
        widthMin: toNumber(filters.widthMin),
        widthMax: toNumber(filters.widthMax),
        heightMin: toNumber(filters.heightMin),
        heightMax: toNumber(filters.heightMax),
        tradeItemIds: filters.tradeItemId ? [filters.tradeItemId] : [],
        tradeItemGtins: filters.gtin ? [filters.gtin] : [],
        tradeItemRetailerCode: filters.retailerSku ? [filters.retailerSku] : [],
        tradeItemMpns: filters.tradeItemMpns ? [filters.tradeItemMpns] : [],
        categories: filters.category || [],
        censors: filters.censor || [],
        languages: filters.languages || [],
        manufacturerIds: filters.manufacturerId ? [filters.manufacturerId] : [],
        updatedDateStart: filters.updatedDateStart
          ? moment(filters.updatedDateStart).format("YYYY-MM-DD")
          : null,
        updatedDateEnd: filters.updatedDateEnd
          ? moment(filters.updatedDateEnd).format("YYYY-MM-DD")
          : null,
      };
      const promise = searchVideosCms(
        pageSize,
        pageNumber,
        formattedFilters
      ).then(async (res) => {
        const retailerIds = uniq(
          res.data.results.map((video) => video.authorizedRetailerIds).flat()
        );

        setCategoryOptions(Object.keys(res.data.categories || {}));
        setCensorOptions(Object.keys(res.data.censors || {}));
        setLanguageOptions(Object.keys(res.data.languages || {}));

        return Promise.all([
          ...retailerIds.map((retailerId) =>
            getRetailerByIdCms(retailerId).then(
              (retailerRes) => retailerRes.data
            )
          ),
        ]).then((retailers) => {
          const results = res.data.results.map((result) => ({
            ...result,
            authorizedRetailersData: (result.authorizedRetailers || []).map(
              (authorizedRetailerId) =>
                retailers.find(
                  (retailer) => retailer.id === authorizedRetailerId
                )
            ),
          }));

          return {
            ...res,
            data: {
              ...res.data,
              pageNumber: res.data.pageNumber,
              results,
            },
          };
        });
      });

      return searchVideos(promise, pageNumber, pageSize);
    },
    [searchVideos]
  );

  useEffect(() => {
    search(
      paginationModel.page,
      paginationModel.pageSize || DEFAULT_PAGE_SIZE,
      filters
    );
  }, [search, filters, paginationModel]);

  const columns = useMemo(() => {
    return [
      {
        headerName: translate("video.table.title"),
        field: "title",
        flex: 2,
        sortable: false,
      },
      {
        headerName: translate("video.table.categories"),
        field: "videoCategories",
        flex: 1,
        valueGetter: ({ row }) => join(row.videoCategories, ", "),
        sortable: false,
      },
      {
        headerName: translate("video.table.languages"),
        field: "languageCodes",
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => (
          <Text>
            {map(row.languageCodes, (l, kLang) => (
              <Padding key={`banner-change-lang-${kLang}`} inline right={2}>
                <Flag code={l} />
              </Padding>
            ))}
          </Text>
        ),
      },
      {
        headerName: translate("video.table.rating"),
        field: "censors",
        flex: 1,
        sortable: false,
        renderCell: ({ row }) =>
          map(row.censors, (censor) => (
            <VideoRatingImage key={censor} censor={censor} />
          )),
      },
      {
        headerName: translate("video.table.retailer"),
        field: "authorizedRetailers",
        flex: 1,
        sortable: false,
        valueGetter: ({ row }) =>
          join(
            row.authorizedRetailersData.map(
              (retailer) => retailer && retailer.name
            ),
            ", "
          ),
      },
      {
        headerName: "Actions",
        field: "actions",
        sortable: false,
        renderCell: ({ row }) => (
          <IconButton
            color="primary"
            size="large"
            aria-label="View collection details"
            sx={{
              padding: 0.5,
            }}
            onClick={() => history.push(`/update-video/${row.id}`)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        ),
      },
    ];
  }, [history, translate]);

  const updateFilterValue = useCallback(
    (f) => setFilters((pf) => ({ ...pf, [f.key]: f.value })),
    []
  );

  const onSearchChanged = useCallback(
    (searchText) => {
      updateFilterValue({ key: "title", value: searchText });
    },
    [updateFilterValue]
  );

  const updateFilters = useCallback(
    (f) => {
      updateUrl(f, history);
      setFilters(f);
    },
    [history]
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    updateUrl(DEFAULT_FILTERS, history);
  }, [history]);

  useEffect(() => {
    const qs = parseQueryStringToObject(location.search.substring(1));
    const v = parseInt(get(qs, "refresh") || 0);
    if (v > 0) {
      updateFilters({ ...qs, refresh: 0 });
    }
  }, [location, history, updateFilters]);

  return (
    <Zone>
      <Row>
        {/* Filters */}
        <Col col>
          <VideosFilters
            onFilterChanged={updateFilterValue}
            onSearchChanged={onSearchChanged}
            onFiltersChanged={updateFilters}
            onFiltersClear={clearFilters}
            filters={filters}
            defaultFilters={DEFAULT_FILTERS}
            categoryOptions={categoryOptions}
            censorOptions={censorOptions}
            languageOptions={languageOptions}
          />
        </Col>
      </Row>

      <Margin top={3} />
      <CdmDataGrid
        columns={columns}
        rows={videos.data}
        loading={videos.loading}
        showPaginationTop
        pageSizeOptions={DEFAULT_PAGE_OPTIONS}
        paginationModel={{
          pageSize: videos.pageSize,
          page: videos.pageNumber || 0,
        }}
        onPaginationModelChange={(params) => {
          setPaginationModel(params);
        }}
        rowCount={videos.total}
        paginationMode="server"
        disableColumnMenu
      />
    </Zone>
  );
}

export default withLocalization(Videos);
