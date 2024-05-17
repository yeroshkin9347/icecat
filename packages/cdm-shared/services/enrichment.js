import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const RETAILER_BASE_URL = `${env.CDM_ENRICHMENT_SERVICE_URI}/public/api/retailer`;
const CMS_BASE_URL = `${env.CDM_ENRICHMENT_SERVICE_URI}/public/api/cms`;
const UNMATCH_BY_TRADE_ITEM_ID = `${CMS_BASE_URL}/CmsRequestedTradeItem/UnMatchByTradeItemId`;
const REMOVE_ENRICHMENT_DATA_BY_ID = `${CMS_BASE_URL}/CmsRequestedTradeItem/removeEnrichmentDataById`;
const UPDATE_ENRICHMENT = `${CMS_BASE_URL}/CmsRequestedTradeItem/UpdateRequestedTradeItem`;
const CREATE_MATCHED_ENRICHMENT_REQUEST = `${CMS_BASE_URL}/CmsRequestedTradeItem/CreateMatchedTradeItemRequest`;

const getPagedEnrichmentRequestedTradeItemsForRetailer = (filters) =>
  axios.get(
    `${RETAILER_BASE_URL}/RetailerRequestedTradeItem/GetPaged`,
    {
      params: filters,
    }
  );

const removeEnrichmentRequestForRetailer = (id) => {
  return axios.delete(`${RETAILER_BASE_URL}/RetailerRequestedTradeItem/${id}`);
};

const unmatchByTradeItemId = ({ tradeItemId, matchedTradeItemId }) => {
  return axios.post(
    `${UNMATCH_BY_TRADE_ITEM_ID}?enrichmentId=${tradeItemId}&tradeItemId=${matchedTradeItemId}`
  );
};

const updateEnrichment = (enrichment) => {
  const data = {
    id: enrichment.id,
    retailerId: enrichment.retailerId,
    tradeItemRetailerCode: enrichment.tradeItemRetailerCode,
    languageCode: enrichment.languageCode,
  };
  return axios.put(`${UPDATE_ENRICHMENT}`, data);
};

const createMatchedEnrichmentRequest = (enrichment) => {
  return axios.post(`${CREATE_MATCHED_ENRICHMENT_REQUEST}`, enrichment);
};

const removeEnrichment = (id) => {
  return axios.delete(`${REMOVE_ENRICHMENT_DATA_BY_ID}/${id}`);
};

export {
  getPagedEnrichmentRequestedTradeItemsForRetailer,
  removeEnrichmentRequestForRetailer,
  createMatchedEnrichmentRequest,
  updateEnrichment,
  unmatchByTradeItemId,
  removeEnrichment,
};
