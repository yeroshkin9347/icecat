import { updateUrl } from "../utils/url";

const getFilteredTableInitialState = defaultFilters => ({
  pageNumber: 0,
  pageSize: 20,
  total: 0,
  results: [],
  loading: false,
  filters: defaultFilters,
  defaultFilters
});

const paginatedFilterableDataReducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.value };
    case "setResults":
      return {
        ...state,
        results: action.results || [],
        total: action.total || 0
      };
    case "setPageNumber":
      return { ...state, pageNumber: action.value };
    case "setPageSize":
      return { ...state, pageSize: action.value };
    case "setFilters":
      return { ...state, filters: action.value };
    case "setFilter":
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value }
      };
    case "resetFilters":
      return { ...state, filters: { ...state.defaultFilters } };

    default:
      return state;
  }
};

const paginatedFilterableDataUrlReducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return paginatedFilterableDataReducer(state, action);
    case "setResults":
      return paginatedFilterableDataReducer(state, action);
    case "setPageNumber":
      return paginatedFilterableDataReducer(state, action);
    case "setPageSize":
      return paginatedFilterableDataReducer(state, action);
    case "setFilters":
      updateUrl(action.value);
      return { ...state, filters: action.value };
    case "setFilter":
      let newFilters = { ...state.filters, [action.key]: action.value };
      updateUrl(newFilters);
      return { ...state, filters: newFilters };
    case "setFilterValues":
      newFilters = { ...state.filters, ...action.values };
      updateUrl(newFilters);
      return { ...state, filters: newFilters };
    case "resetFilters":
      updateUrl({ ...state.defaultFilters });
      return { ...state, filters: { ...state.defaultFilters } };

    default:
      return state;
  }
};

export { getFilteredTableInitialState, paginatedFilterableDataUrlReducer };

export default paginatedFilterableDataReducer;
