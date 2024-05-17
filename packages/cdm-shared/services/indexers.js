import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const GET_RETAILER_TRADE_ITEM_INDEXERS_URI = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/RetailerApiTradeItemIndexer`;

//GetSendingStatus
export const getRetailerTradeItemIndexers = (tradeItemId, lang) =>
  axios.get(`${GET_RETAILER_TRADE_ITEM_INDEXERS_URI}/${lang}/${tradeItemId}`);

export const getRetailerTradeItemsDetail = (tradeItemsIds, lang) =>
  axios.post(`${GET_RETAILER_TRADE_ITEM_INDEXERS_URI}/getTradeItems`, { localeCode: lang, tradeItemsIds });
