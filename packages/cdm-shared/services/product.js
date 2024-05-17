import axios from "axios";
import get from "lodash/get";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const SUGGEST = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/suggest`;
const GET_SUGGESTION = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/getSuggestionByTradeItemId`;
const SEARCH = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/search`;
const FULLSEARCH = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/fullsearch`;
const FETCH = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer`;
const FETCH_BY_TRADE_ITEM_ID = `${FETCH}/GetByTradeItemId`;
const GET_BY_IDS = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/GetByTradeItemIds`;
const LOGISTIC_GET_FULL_HIERARCHY = `${env.CDM_LOGISTIC_URI}/api/tradeitem/getFullHierarchyForUi`;
const LOGISTIC_GET_RESTRICTED_HIERARCHY = `${env.CDM_LOGISTIC_URI}/api/tradeitem/getFullHierarchyForUiLight`;
const GET_PRICING = `${env.CDM_PRICING_URI}/api/pricing/GetByTradeItemIdForUI`;
const GENERATE_PDF = `${env.CDM_GENERATE_PDF}`;
const EXPORT_VIDEO = `${env.CDM_EXPORT_VIDEO}`;

const BASE_STORAGE = `${env.CDM_STORAGE_SERVICE_URI}`;
const STORAGE_UPDATE_PROPERTIES_VALUES = `${BASE_STORAGE}/todo`;
const STORAGE_GET_TRADE_ITEM_FOR_MANUFACTURER = `${BASE_STORAGE}/api/ManufacturerCatalog`;
const STORAGE_RETAILER_GET_TRADE_ITEM_BY_LANG = `${BASE_STORAGE}/api/RetailerCatalog`;
const STORAGE_MANUFACTURER_GET_TRADE_ITEM_BY_LANG = `${BASE_STORAGE}/api/ManufacturerCatalog`;
const STORAGE_CMS = `${BASE_STORAGE}/api/v2/Cms`;
const REQUESTEDTRADEITEM = `${env.CDM_ENRICHMENT_SERVICE_URI}/api/cms/CmsRequestedTradeItem`;

const PRE_COMPUTE = `${env.CDM_PRE_COMPUTING_SERVICE_URI}/api/PreComputingJob/PreComputeForTradeItem`;

// Suggest a product for autocomplete
//
export const suggest = (lang, value) =>
  axios.get(`${SUGGEST}/${lang}/${value}`);

// Suggest a product by get on tradeItemId
//
export const getSuggestionByTradeItemId = (tradeItemId, lang) =>
  axios.get(`${GET_SUGGESTION}/${lang}/${tradeItemId}`).then((res) => res.data);

// Indexer simple search
//
export const search = (lang, filters) => {
  let params = Object.assign({}, filters, { keyword: filters.keyword || null });
  return axios.get(`${SEARCH}/${lang}`, {
    params: params,
  });
};

// Full indexer search
//
export const fullSearch = (lang, limit, searchAfter, filters) => {
  return axios.get(`${FULLSEARCH}/${lang}`, {
    params: {
      limit,
      searchAfter,
      ...(filters || {}),
    },
  });
};

// Get detail trade item information
//
export const getTradeItemById = (lang, tradeItemId) =>
  axios.get(`${FETCH}/${lang}/${tradeItemId}`);

// Get detail trade item information
//
export const fetchTradeItemById = (lang, tradeItemId) =>
  axios.get(`${FETCH_BY_TRADE_ITEM_ID}/${lang}/${tradeItemId}`);

export const getTradeItems = (langCode, tradeItemIds) =>
  Promise.all(
    tradeItemIds.map((tradeItemId) => (
      fullSearch(langCode, 1, 0, { TradeItemId: tradeItemId })
        .then((res) => res.data.results[0])
        .catch(() => {
          return null
        })
    ))
  ).then((values) => {
    return values.filter((item) => !!item);
  });

export const getTradeItemsByIds = (tradeItemIds, langCode = 'en-GB') =>
  axios.post(`${GET_BY_IDS}/${langCode}`, tradeItemIds);

// Get logistic trade item information
//
export const getLogistic = (tradeItemId) =>
  axios.get(`${LOGISTIC_GET_FULL_HIERARCHY}/${tradeItemId}`);

// Get restricted logistic trade item information
//
export const getRestrictedLogistic = (tradeItemId) =>
  axios.get(`${LOGISTIC_GET_RESTRICTED_HIERARCHY}/${tradeItemId}`);

// Get pricing trade item information
//
export const getPricing = (tradeItemId, flatten) =>
  axios.get(`${GET_PRICING}`, {
    params: {
      tradeItemId,
      flatten: flatten === false ? false : true,
    },
  });

// Override properties values
//
export const updatePropertiesValues = (actionId, tradeItemId, values) =>
  axios.post(`${STORAGE_UPDATE_PROPERTIES_VALUES}`, {
    tradeItemId,
    actionId,
    values,
  });

export const getTradeItemPdf = (
  gtin,
  manufacturerExternalId,
  langCode,
  pricing
) =>
  axios({
    url: `${GENERATE_PDF}/gtin/${gtin}/manufacturerExternalId/${manufacturerExternalId}/langCode/${langCode}/pricing/${pricing}`,
    method: "GET",
    responseType: "blob",
    maxContentLength: 5000000,
    crossdomain: true,
  });

export const exportVideo = (videoId, retailerExternalId) =>
  axios({
    url: `${EXPORT_VIDEO}/videoContentId/${videoId}/clientId/${retailerExternalId}`,
    method: "GET",
    crossdomain: true,
  });

// Get trade item for manufacturer
//
export const getTradeItemForManufacturer = (tradeItemId, locale) =>
  axios.get(
    `${STORAGE_GET_TRADE_ITEM_FOR_MANUFACTURER}/${tradeItemId}${
      locale ? `/${locale}` : ""
    }`
  );

export const getTradeItemsForManufacturer = (tradeItemIds) =>
  Promise.all(
    tradeItemIds.map((tradeItemId) => getTradeItemForManufacturer(tradeItemId))
  ).then((values) => {
    return values;
  });

export const getTradeItemCms = (tradeItemId) =>
  axios.get(`${STORAGE_CMS}/${tradeItemId}`);

export const getTradeItemsCms = (tradeItemIds) =>
  Promise.all(
    tradeItemIds.map((tradeItemId) => getTradeItemCms(tradeItemId))
  ).then((values) => {
    return values;
  });

// Update trade item
//
export const manufacturerUpdateTradeItem = (tradeItem) =>
  axios.put(
    `${STORAGE_GET_TRADE_ITEM_FOR_MANUFACTURER}/${get(
      tradeItem,
      "tradeItemId"
    )}`,
    { ...tradeItem }
  );

// Create trade item
//
export const manufacturerCreateTradeItem = (tradeItem) =>
  axios.post(`${STORAGE_GET_TRADE_ITEM_FOR_MANUFACTURER}`, { ...tradeItem });

// Get trade item from storage for retailer
export const getRetailerTradeItem = (tradeItemId, locale) =>
  axios.get(
    `${STORAGE_RETAILER_GET_TRADE_ITEM_BY_LANG}/${tradeItemId}${
      locale ? `/${locale}` : ""
    }`
  );

// Get trade item by lang from storage
//
export const getRetailerTradeItemByLang = (languageCode, tradeItemId) =>
  axios.get(
    `${STORAGE_RETAILER_GET_TRADE_ITEM_BY_LANG}/${tradeItemId}/${languageCode}`
  );

export const getManufacturerTradeItemByLang = (languageCode, tradeItemId) =>
  axios.get(
    `${STORAGE_MANUFACTURER_GET_TRADE_ITEM_BY_LANG}/${tradeItemId}/${languageCode}`
  );

// CMS API
//
export const cmsGetTradeItemByLang = (languageCode, tradeItemId) =>
  axios.get(`${STORAGE_CMS}/${tradeItemId}/${languageCode}`);

export const cmsCreateTradeItem = (tradeItem, manufacturerId) =>
  axios.post(
    `${STORAGE_CMS}`,
    { ...tradeItem },
    { params: { manufacturerId } }
  );

export const cmsUpdateTradeItem = (tradeItem) =>
  axios.put(`${STORAGE_CMS}/${get(tradeItem, "tradeItemId")}`, {
    ...tradeItem,
  });

export const cmsGetTradeItem = (tradeItemId, locale) =>
  axios.get(`${STORAGE_CMS}/${tradeItemId}${locale ? `/${locale}` : ""}`);

export const getRequestedTradeItem = (tradeItemId) =>
  axios.get(`${REQUESTEDTRADEITEM}/${tradeItemId}`);

export const preCompute = (tradeItemId) =>
  axios.post(PRE_COMPUTE, null, { params: { tradeItemId } });

export const deleteProduct = (tradeItemId) =>
  axios.delete(`${BASE_STORAGE}/api/Cms/`, {
    params: { tradeItemId },
  });
