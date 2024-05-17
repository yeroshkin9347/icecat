import React, { useCallback, useEffect, useState } from "react";
import map from "lodash/map";
import get from "lodash/get";
import size from "lodash/size";
import keyBy from "lodash/keyBy";
import usePaginatedData from "cdm-shared/hook/usePaginatedData";
import { fullSearch } from "cdm-shared/services/product";
import { Margin, Button, Zone, Row, Col } from "cdm-ui-components";
import { DEFAULT_FILTERS } from "./reducer";
import { getTradeItemsPrecomputingStatus } from "cdm-shared/services/precomputing";
import { withLocalization } from "common/redux/hoc/withLocalization";
import ProductsFilters from "./ProductsFilters";
import ProductsTable from "cdm-shared/component/product/ProductsTable";
import useLocalization from "cdm-shared/hook/useLocalization";
import { useHistory, useLocation } from "react-router-dom";
import {
  paramObject,
  parseQueryStringToObject,
  updateUrl,
} from "cdm-shared/utils/url";

const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_SEARCH_AFTER = null;
const tableActions = ['edit'];

// products search view
function Products({ translate }) {
  const [products, searchProducts] = usePaginatedData({
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: DEFAULT_SEARCH_AFTER,
  });
  const [filters, setFilters] = useState(paramObject() || DEFAULT_FILTERS);
  const [manufacturersCount, setManufacturersCount] = useState(null);
  const [currentLocaleCode] = useLocalization();
  // const [refreshCounter, setRefreshCounter] = useState(0);
  const history = useHistory();
  const location = useLocation();

  const search = useCallback(
    (searchAfter, pageSize, f) => {
      const promise = fullSearch(
        currentLocaleCode,
        pageSize,
        searchAfter,
        f
      ).then((res) => {
        const tradeItemIds = map(
          get(res, "data.results"),
          (d) => d.tradeItemId
        );
        if (tradeItemIds.length === 0) {
          setManufacturersCount(null);
          return { data: { results: [] } };
        }

        setManufacturersCount(res.data.manufacturersCount);

        return getTradeItemsPrecomputingStatus(tradeItemIds).then(
          (precomputingRes) => {
            if (!size(get(precomputingRes, "data.tradeItemPreComputingStatus")))
              return res;
            const keyedData = keyBy(
              get(precomputingRes, "data.tradeItemPreComputingStatus") || [],
              "tradeItemId"
            );

            return {
              ...res,
              data: {
                ...res.data,
                pageNumber: res.data.searchAfter,
                results: map(res.data.results, (r) => ({
                  ...r,
                  precomputingStatus: keyedData[r.tradeItemId]
                    ? get(keyedData[r.tradeItemId], "status")
                    : null,
                })),
              },
            };
          }
        ).catch(() => {
          return {
            ...res,
            data: {
              ...res.data,
              pageNumber: res.data.searchAfter,
              results: res.data.results,
            },
          };
        });
      });
      return searchProducts(promise, searchAfter, pageSize);
    },
    [searchProducts, currentLocaleCode]
  );

  useEffect(() => {
    search(DEFAULT_SEARCH_AFTER, DEFAULT_PAGE_SIZE, filters);
  }, [search, filters]);

  const updateFilterValue = useCallback(
    (f) => setFilters((pf) => ({ ...pf, [f.key]: f.value })),
    []
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
  }, []);

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
        <Col col={2}>
          {/* Create new product */}
          <Button
            small
            primary
            inline
            onClick={() => history.push(`/create-product`)}
          >
            {translate("product.main.createNew")}
          </Button>
        </Col>

        {/* Filters */}
        <Col col>
          <ProductsFilters
            onFilterChanged={updateFilterValue}
            onFiltersChanged={updateFilters}
            onFiltersClear={clearFilters}
            filters={filters}
            defaultFilters={DEFAULT_FILTERS}
            manufacturersCount={manufacturersCount}
          />
        </Col>
      </Row>

      <Margin top={3} />
      <ProductsTable
        products={products.data}
        loading={products.loading}
        actions={tableActions}
      />
    </Zone>
  );
}

export default withLocalization(Products);
