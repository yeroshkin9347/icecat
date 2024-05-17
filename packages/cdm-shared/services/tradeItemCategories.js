import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//

export const GET_TRADE_ITEM_CATEGORIES_API_URL = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/manufacturer/ManufacturerTradeItemCategory`;
export const GET_TRADE_ITEM_CATEGORIES_API_URL_CMS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsTradeItemCategory`

// Get trade item properties by scope
// scopes: LicencedProducts, Toys...
//
export const getAllTradeItemCategories = (lang = env.CDM_DEFAULT_LANG) =>
    axios.get(`${GET_TRADE_ITEM_CATEGORIES_API_URL}/GetAll/${lang}`);

export const getAllTradeItemCategoriesCMS = (lang = env.CDM_DEFAULT_LANG) =>
  axios.get(`${GET_TRADE_ITEM_CATEGORIES_API_URL_CMS}/GetAll/${lang}`);

export const searchTradeItemCategories = (lang = env.CDM_DEFAULT_LANG, query) =>
  axios.get(`${GET_TRADE_ITEM_CATEGORIES_API_URL}/GetPaged/${lang}`, { params: query });

export const searchTradeItemCategoriesCMS = (lang = env.CDM_DEFAULT_LANG, query) =>
  axios.get(`${GET_TRADE_ITEM_CATEGORIES_API_URL_CMS}/GetPaged/${lang}`, { params: query });
