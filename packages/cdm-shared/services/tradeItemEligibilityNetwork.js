import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const MANUFACTURER_BASE_URL = `${env.CDM_TRADE_ITEM_ELIGIBILITY_NETWORK_URI}/api/manufacturer/ManufacturerNetworkEligibility`;

export const getPagedEligibilityNetworkForManufacturer = (
  pageNumber,
  pageSize,
  filters
) =>
  axios.get(`${MANUFACTURER_BASE_URL}/paged`, {
    params: {
      pageNumber,
      pageSize,
      ...filters
    }
  });

export const exportEligibilityNetworkForManufacturer = filters =>
  axios.get(`${MANUFACTURER_BASE_URL}/exportExcel`, {
    responseType: 'blob',
    params: {
      ...filters
    }
  });

export const getTradeItemEligibilityById = id =>
  axios.get(`${MANUFACTURER_BASE_URL}/${id}`);

export const getTradeItemEligibilityForTradeItemIdGroupedByRetailer = tradeItemId =>
  axios.get(`${MANUFACTURER_BASE_URL}/getByTradeItemIdGroupedByRetailer`, {
    params: {
      tradeItemId
    }
  });

  export const getMilestonesDetails = (milestones) => {
    return axios.post(`${MANUFACTURER_BASE_URL}/GetStatistics`, {
      getStatisticsEntriesRequest : milestones
    });
  }