import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//

const GET_EXPORT_STATISTICS_FOR_MANUFACTURER_URI = `${env.CDM_EXPORT_STATISTICS_URI}/api/Manufacturer/ExportStatistic/GetPaged`;
const GET_EXPORT_STATISTICS_FOR_RETAILER_URI = `${env.CDM_EXPORT_STATISTICS_URI}/api/Retailer/ExportStatistic/GetPaged`;

const GET_RETAILERS_FOR_MANUFACTURER_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/connection/GetLinkedRetailers`;
const GET_ACTIONS_FOR_MANUFACTURER_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action/GetLightByManufacturer`;
const GET_ACTIONS_FOR_RETAILER_URI = `${env.CDM_EXPORT_STATISTICS_URI}/api/Retailer/ExportStatistic/GetExportActionsForRetailer`;
const MANUFACTURER_EXPORT_CSV = `${env.CDM_EXPORT_STATISTICS_URI}/api/Manufacturer/ExportStatistic/ExportCsv`;
const RETAILER_EXPORT_CSV = `${env.CDM_EXPORT_STATISTICS_URI}/api/Retailer/ExportStatistic/ExportCsv`;
const GET_SENDING_STATUS = `${env.CDM_EXPORT_STATISTICS_URI}/api/Retailer/ExportStatistic/GetSendingStatus`;

// get stats
export const getExportStatisticsForManufacturer = (
  pageNumber,
  pageSize,
  exportStatisticFilters,
  groupByTradeItem
) => {
  let params = null;
  if (groupByTradeItem) {
    params = {
      pageNumber,
      pageSize,
      groupByTradeItem
    };
  } else
    params = {
      pageNumber,
      pageSize
    };
  return axios.post(`${GET_EXPORT_STATISTICS_FOR_MANUFACTURER_URI}`, exportStatisticFilters, {
    params: params
  });
};
export const getExportStatisticsForRetailer = (
  pageNumber,
  pageSize,
  exportStatisticFilters,
  groupByTradeItem
) => {
  let params = null;
  if (groupByTradeItem) {
    params = {
      pageNumber,
      pageSize,
      groupByTradeItem
    };
  } else
    params = {
      pageNumber,
      pageSize
    };
  return axios.post(`${GET_EXPORT_STATISTICS_FOR_RETAILER_URI}`, exportStatisticFilters, {
    params: params
  });
};

// export stats
export const exportStatisticsForManufacturer = (exportStatisticFilters, groupByTradeItem) => {
  let params = null;
  if (groupByTradeItem) {
    params = {
      groupByTradeItem
    };
  }
  return axios.post(`${MANUFACTURER_EXPORT_CSV}`, exportStatisticFilters, {
    params: params
  });
};

export const exportStatisticsForRetailer = (exportStatisticFilters, groupByTradeItem) => {
  let params = null;
  if (groupByTradeItem) {
    params = {
      groupByTradeItem
    };
  }
  return axios.post(`${RETAILER_EXPORT_CSV}`, exportStatisticFilters, {
    params: params
  });
};

//GetExportedRetailersForManufacturer
export const getExportedRetailersForManufacturer = manufacturerId =>
  axios.get(`${GET_RETAILERS_FOR_MANUFACTURER_URI}`, {
    params: {
      manufacturerId
    }
  });

//GetExportActionsForManufacturer
export const getExportActionsForManufacturer = () =>
  axios.get(`${GET_ACTIONS_FOR_MANUFACTURER_URI}`);

//GetSendingStatus
export const getSendingStatusForRetailer = tradeItemIds =>
  axios.get(`${GET_SENDING_STATUS}`, {
    params: {
      tradeItemIds
    }
  });

  export const getExportActionsForRetailer = retailerId =>
  axios.get(`${GET_ACTIONS_FOR_RETAILER_URI}`, {
    params: {
      retailerId
    }
  });
