import axios from "axios";
import qs from "qs";
import * as env from "cdm-shared/environment";
import get from "lodash/get";
import { downloadContent } from "cdm-shared/utils/url";

// Set the services URIs
//
const LAUNCH_ACTION_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action/LaunchAction`;
const GET_ACTIONS = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action`;
const GET_ACTION_BY_IDS_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action/GetByActionIdsForUi`;
const GET_ACTION_BY_IDS_NO_TYPE_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action/GetByActionIds`;
const SEARCH_AND_EXPORT = `${env.CDM_TRADE_ITEM_INDEXER_URI}/api/TradeItemIndexer/searchAndExport`;
const GET_PAGED_ACTIONS_RESULTS = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/ActionExecutionResult/GetLightActionExecutionResults`;
const GET_ACTIONS_RESULT = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/ActionExecutionResult`;
const LAUNCH_EXPORT_DIGITAL_ASSETS_ACTION = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action/LaunchExportDigitalAssetsAction`;

// Trigger an export
//
export const launchActionById = (actionId, params) => {
  return axios.put(`${LAUNCH_ACTION_URI}`, params || {}, {
    params: {
      actionId
    }
  });
};

export const getPreComputingActions = () => axios.get(`${GET_ACTIONS}`);

export const getPreComputingActionsForManufacturer = () =>
  axios.get(`${GET_ACTIONS}/GetLightByManufacturer`);

export const getActionById = actionId =>
  axios.get(`${GET_ACTIONS}/${actionId}`);

export const getByActionIds = actionIds => {
  return axios.post(`${GET_ACTION_BY_IDS_URI}`, actionIds);
};

export const getByActionIdsNoType = actionIds => {
  return axios.get(`${GET_ACTION_BY_IDS_NO_TYPE_URI}`, {
    params: {
      actionIds
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    }
  });
};

export const getByActionIdsForPdf = getByActionIdsNoType;

export const searchAndExport = (
  lang,
  filters,
  exportActionId,
  actionParameters
) => {
  return axios.post(`${SEARCH_AND_EXPORT}/${lang}`, filters || {}, {
    params: {
      exportActionId,
      actionParameters
    },
    paramsSerializer: params => {
      return qs.stringify(params, { allowDots: true });
    }
  });
};

export const getPagedActionsResults = (pageNumber, pageSize) =>
  axios.get(`${GET_PAGED_ACTIONS_RESULTS}`, {
    params: {
      pageNumber,
      pageSize
    }
  });

export const getActionsResult = actionId =>
  axios.get(`${GET_ACTIONS_RESULT}/${actionId}`);

export const downloadZip = response =>
  downloadContent(get(response, "output.zipPath"));

export const launchExportDigitalAssetsAction = (data) => {
  return axios.put(`${LAUNCH_EXPORT_DIGITAL_ASSETS_ACTION}`, data);
};
