import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";
import qs from "qs";
import { localStorageGetItem } from "../utils/localStorage";

// Set the services URIs
//
const IMPORT_SERVICE_BASE_URI = `${env.CDM_IMPORT_SERVICE_URI}/api/manufacturer/ManufacturerImportJob`;
const IMPORT_SERVICE_CMS_BASE_URI = `${env.CDM_IMPORT_SERVICE_URI}/api/Cms`;
const CATALOG_TRADE_ITEM_IMPORT_REPORT = `${env.CDM_IMPORT_SERVICE_URI}/api/CatalogTradeItemImportReport`;
const CATALOG_TRADE_ITEM_PROPERTIES_IMPORT_REPORT = `${env.CDM_IMPORT_SERVICE_URI}/api/CatalogTradeItemPropertiesImportReport`;
const MATRIX_VALIDATION_BASE_URI = `${env.CDM_MATRIX_VALIDATION_SERVICE_URI}/api/manufacturer/ManufacturerMappingFailedResult/GetPagedByContextIdGroupedByTradeItem`;
const BUSINESS_RULE_EVAL_BASE_URI = `${env.CDM_BUSINESS_RULE_EVAL_SERVICE_URI}/public/api/manufacturer/ManufacturerBusinessRuleEvaluation/GetPagedGroupByTradeItem`;
const GET_PERSISTENCE_ERRORS = `${env.CDM_STORAGE_SERVICE_URI}/api/PersistenceResult/GetPaged`;

const importInstance = axios.create({
  baseURL: CATALOG_TRADE_ITEM_PROPERTIES_IMPORT_REPORT,
});

importInstance.interceptors.request.use(function (config) {
  const token = localStorageGetItem("token");
  if (token) {
    if (config.headers.sendToken !== false)
      config.headers.common["Authorization"] = "Bearer " + token;
    // config.headers.common['Content-Type'] = 'application/json'
    config.paramsSerializer = (params) =>
      qs.stringify(params, { arrayFormat: "indices", allowDots: true });
  }
  return config;
});

// Get all paged import jobs
export const getPagedImportJobs = (pageSize, pageNumber, manufacturerId) =>
  axios.get(`${IMPORT_SERVICE_BASE_URI}`, {
    params: { pageSize, pageNumber, manufacturerId },
  });

// Get trade item import reports
export const getImportReports = (pageSize, pageNumber, importId, filters) =>
  axios.get(
    `${CATALOG_TRADE_ITEM_IMPORT_REPORT}/${pageSize}/${pageNumber}/${importId}`,
    { params: filters }
  );

// Get import job
export const getImportJob = (id) =>
  axios.get(`${IMPORT_SERVICE_BASE_URI}/${id}`);

// Get import job
export const getTradeItemDetail = (
  pageSize,
  pageNumber,
  importId,
  tradeItemId,
  filters
) =>
  importInstance.get(`/${pageSize}/${pageNumber}/${importId}/${tradeItemId}`, {
    params: filters,
  });

// Upload excel
export const importMatrix = (manufacturerEntityId, file) => {
  const data = new FormData();
  data.append("file", file);
  return axios.post(`${IMPORT_SERVICE_BASE_URI}/${manufacturerEntityId}`, data);
};

// Get mapping errors
export const getImportMappingErrors = (
  contextId,
  pageNumber,
  pageSize,
  gtin,
  tradeItemManufacturerCode,
  languageCode,
) =>
  axios.get(`${MATRIX_VALIDATION_BASE_URI}`, {
    params: {
      contextId,
      pageSize,
      pageNumber,
      gtin,
      tradeItemManufacturerCode,
      languageCode,
    },
  });

// Get business rules errors
export const getImportBusinessRulesErrors = (
  contextId,
  pageNumber,
  pageSize,
  languageCode,
  gtin,
  tradeItemManufacturerCode
) =>
  axios.get(`${BUSINESS_RULE_EVAL_BASE_URI}`, {
    params: {
      contextId,
      pageSize,
      pageNumber,
      languageCode,
      gtin,
      tradeItemManufacturerCode,
    },
  });

// Get persistence errors
export const getImportPersistenceErrors = (contextId, pageNumber, pageSize) =>
  axios.get(`${GET_PERSISTENCE_ERRORS}`, {
    params: { contextId, pageSize, pageNumber },
  });

// CMS
//
// Get all paged import jobs
export const getPagedImportJobsCms = (pageNumber, pageSize) =>
  axios.get(`${IMPORT_SERVICE_CMS_BASE_URI}`, {
    params: { pageSize, pageNumber },
  });

// Get import job
export const getImportJobCms = (id) =>
  axios.get(`${IMPORT_SERVICE_CMS_BASE_URI}/${id}`);

// Upload excel
export const importMatrixCms = (manufacturerEntityId, file) => {
  const data = new FormData();
  data.append("file", file);
  return axios.post(
    `${IMPORT_SERVICE_CMS_BASE_URI}/${manufacturerEntityId}`,
    data
  );
};

export const exportMappingErrors = (
  contextId,
  gtin,
  tradeItemManufacturerCode,
  languageCode
) =>
  axios.post(
    `${env.CDM_MATRIX_VALIDATION_SERVICE_URI}/api/manufacturer/MappingFailedResult/ExportMappingErrorsExcel`,
    null,
    {
      responseType: 'blob',
      params: {
        contextId,
        gtin,
        tradeItemManufacturerCode,
        languageCode,
      }
    }
  );

export const exportDataIssues = (
  contextId,
  gtin,
  tradeItemManufacturerCode,
  languageCode
) =>
  axios.post(
    `${env.CDM_BUSINESS_RULE_EVAL_SERVICE_URI}/public/api/BusinessRuleEvaluation/ExportDataIssuesCsv`,
    null,
    {
      params: {
        contextId,
        gtin,
        tradeItemManufacturerCode,
        languageCode,
      }
    }
  );
