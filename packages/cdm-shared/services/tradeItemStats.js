import axios from "axios";
import get from "lodash/get";
import "./index";
import * as env from "cdm-shared/environment";
import { fullSearch } from "./product";
import { defaultFilters } from "catalog/models";
import { date } from "../utils/date";

// STATS
//
// MANUFACTURER CONTROLLER
const MANUFACTURER_BASE = `${env.CDM_TRADE_ITEM_STATS_SERVICE_URI}/api/ManufacturerCatalog`;
const MANUFACTURER_GET_FILTERS = `${MANUFACTURER_BASE}/GetFilters`;
// const MANUFACTURER_STATS = `${env.CDM_TRADE_ITEM_STATS_SERVICE_URI}/api/ManufacturerCatalog/GetManufacturerStatistics`

export const getManufacturerTradeItemsStatistics = filters =>
  axios.get(`${MANUFACTURER_BASE}`, {
    params: filters
  });

export const getManufacturerTradeItemsStatisticsFilters = languageCode =>
  axios.get(`${MANUFACTURER_GET_FILTERS}/${languageCode}`);

export const manufacturerExportCsv = filters =>
  axios.post(`${MANUFACTURER_BASE}/exportCsv`, {
    params: filters
  });

//
// RETAILER CONTROLLER
const RETAILER_BASE = `${env.CDM_TRADE_ITEM_STATS_SERVICE_URI}/api/RetailerCatalog`;
const RETAILER_GET_FILTERS = `${RETAILER_BASE}/GetFilters`;

export const getRetailerTradeItemsStatistics = filters =>
  axios.get(`${RETAILER_BASE}`, {
    params: filters
  });

export const getRetailerTradeItemsStatisticsFilters = languageCode =>
  axios.get(`${RETAILER_GET_FILTERS}/${languageCode}`);

export const retailerExportCsv = filters =>
  axios.post(`${RETAILER_BASE}/exportCsv`, {
    params: filters
  });

// TODO: uncomment when manufacturers stats === indexer results
// export const getManufacturerStatistics = () => axios.get(`${MANUFACTURER_STATS}`)
export const getManufacturerStatistics = () => {
  const now = date(new Date());
  const activeProductsPromise = fullSearch(null, 1, null, {
    ...defaultFilters,
    scope: ["Toys"],
    year: now.format("YYYY"),
    discontinuedDateStart: now.format("YYYY-MM-DD"),
    releaseDateEnd: now.format("YYYY-MM-DD")
  });
  const totalProductsPromise = fullSearch(null, 1, null, {
    ...defaultFilters,
    scope: ["Toys"]
  });

  return Promise.all([activeProductsPromise, totalProductsPromise]).then(
    ([activeProducts, totalProducts]) => {
      const ret = {
        data: {
          numberOfActiveTradeItems: get(activeProducts, "data.total") || 0,
          numberOfTotalTradeItems: get(totalProducts, "data.total") || 0
        }
      };
      return ret;
    }
  );
};
