import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";
import { AGENDA_PRODUCT_CATEGORIES } from "../constants/agenda";

const GET_RETAILER_AGENDA = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/retailer/RetailerAgenda/SearchAgendaEvents`;
const GET_CMS_AGENDA = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/cms/CmsAgenda/SearchAgendaEvents`;
const GET_TRADE_ITEM_CATEGORY_FOR_AGENDA = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/retailer/RetailerTradeItemCategory/GetAllForAgenda`;
const GET_TRADE_ITEM_CATEGORY_FOR_AGENDA_CMS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/admin-suite/AdminSuiteTradeItemCategory/GetAllForAgenda`;

export const getAgendaEventsForRetailer = (params) =>
  axios.get(GET_RETAILER_AGENDA, { params });

export const getAgendaEventsForCms = (params) =>
  axios.get(GET_CMS_AGENDA, { params });

export const getCategoryAgendaForRetailer = (lang = "en-EN") =>
  axios.post(
    `${GET_TRADE_ITEM_CATEGORY_FOR_AGENDA}`,
    AGENDA_PRODUCT_CATEGORIES,
    {
      params: {
        languageCode: lang,
      },
    }
  );

export const getCategoryAgendaForRetailerCms = (lang = "en-EN") =>
  axios.post(
    `${GET_TRADE_ITEM_CATEGORY_FOR_AGENDA_CMS}`,
    AGENDA_PRODUCT_CATEGORIES,
    {
      params: {
        languageCode: lang,
      },
    }
  );
