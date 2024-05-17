import get from "lodash/get";
import size from "lodash/size";
import { areFiltersEmpty } from "./utils";
import memoizeFn from "cdm-shared/utils/memoizeFn";
import { updateUrl } from "cdm-shared/utils/url";

const defaultFilters = {
  scopes: ["Toys"],
  keyword: null,
  manufacturers: null,
  gtin: null,
  tradeItemManufacturerCode: null,
  language: null,
  releaseDateStart: null,
  releaseDateEnd: null,
  updatedDateStart: null,
  updatedDateEnd: null,
  hasImages: false,
  hasNoImages: false,
  hasVideos: false,
  hasNoVideos: false,
  discontinuedDateStart: null,
  discontinuedDateEnd: null,
  seasonality: null,
  npd: null,
  productLine: null,
  year: null,
  consistencyStatus: null
};

const getInitialState = () => {
  return {
    loading: false,
    results: [],
    currentSize: 0,
    areFiltersEmpty: false,
    filters: defaultFilters,
    userDefaultFilters: defaultFilters,
    searchAfter: null,
    limit: 50,
    total: 0,
    showFilters: false,
    manufacturersCount: null,
    emptyFilters: memoizeFn(areFiltersEmpty),
    isActionsRowVisible: false,
    showBasketExportModal: false,
    showSearchExportModal: false,
    exportActionRunning: null,
    initialKeywordFromUrl: null
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    // UI
    case "setActionsVisible":
      return {
        ...state,
        isActionsRowVisible: action.value
      };

    case "setLoading":
      return {
        ...state,
        loading: !!action.value
      };

    // Search data
    case "setSearchData":
      const results = action.loadMore
        ? [...state.results, ...get(action, "data.results")]
        : get(action, "data.results");
      const searchAfter = get(action, "data.searchAfter");
      const total = get(action, "data.total");
      const manufacturers = get(action, "data.manufacturers");
      const brands = get(action, "data.brands");
      const collections = get(action, "data.collections");
      const npdCategories = get(action, "data.npdCategories");
      const categoryNames = get(action, "data.icecatCategories");
      const currentSize = size(results);
      return {
        ...state,
        results,
        searchAfter,
        total,
        manufacturers,
        brands,
        collections,
        npdCategories,
        categoryNames,
        currentSize,
        loading: false
      };

    case "resetSearchData":
      return {
        ...state,
        results: [],
        total: 0,
        manufacturers: null,
        brands: null,
        collections: null,
        npdCategories: null,
        categoryNames: null
      };

    // Filters
    case "setFilters":
      const { value: filters, history } = action;
      updateUrl(filters, history, '/catalog');
      return {
        ...state,
        filters,
        areFiltersEmpty: areFiltersEmpty(filters)
      };

    case "setFilter":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.key]: action.value
        },
        areFiltersEmpty: areFiltersEmpty(filters)
      };

    case "showFilters":
      return {
        ...state,
        showFilters: action.value
      };

    // Export actions
    case "setRunningExportAction":
      return {
        ...state,
        exportActionRunning: action.value
      };

    case "showSearchExportModal":
      return {
        ...state,
        showSearchExportModal: action.value
      };

    case "showBasketExportModal":
      return {
        ...state,
        showBasketExportModal: action.value
      };

    default:
      return state;
  }
};

export { reducer, getInitialState, defaultFilters };
