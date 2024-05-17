import axios from "axios";
import qs from "qs";
import "./index";
import * as env from "cdm-shared/environment";
import { getMethodForUser } from "../component/messaging/actions";
import { localStorageGetItem } from "../utils/localStorage";

// Set the services URIs
//
const RETAILERS_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/retailer`;

const BASE_URI_MANUFACTURER = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/manufacturer/ManufacturerRetailer`;
const GET_ALL_MANUFACTURER = `${BASE_URI_MANUFACTURER}/all`;
const GET_ALL_LIGHT_MANUFACTURER = `${BASE_URI_MANUFACTURER}/GetAllLight`;
const GET_BY_RETAILERS_IDS_MANUFACTURER = `${BASE_URI_MANUFACTURER}/GetByRetailersIdsLight`;

const BASE_URI_RETAILER = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/retailer/RetailerRetailer`;
const GET_ALL_RETAILER = `${BASE_URI_RETAILER}/all`;
const GET_ALL_LIGHT_RETAILER = `${BASE_URI_RETAILER}/GetAllLight`;
const GET_BY_RETAILERS_IDS_RETAILER = `${BASE_URI_RETAILER}/GetByRetailersIdsLight`;

const BASE_URI_CMS = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/cms/CmsRetailer`;
const GET_ALL_CMS = `${BASE_URI_CMS}/all`;
const GET_ALL_LIGHT_CMS = `${BASE_URI_CMS}/GetAllLight`;
const GET_BY_RETAILERS_IDS_CMS = `${BASE_URI_CMS}/GetByRetailersIdsLight`;

const GET_ALL_WITH_ICECAT_ID_FOR_CMS = `${BASE_URI_CMS}/GetRetailersWithIcecatId`;
const GROUPS_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/Group`;
const ENRICHMENT_CONF_BASE_URI = `${env.CDM_RETAILER_MGMNT_SERVICE_URI}/api/EnrichmentConfiguration`;

const getUserFromLocalStorage = () => {
  const user = localStorageGetItem("user");
  if (user) return JSON.parse(user);
  return null;
}

export const getAllRetailers = () => {
  const user = getUserFromLocalStorage();
  const methodURL = getMethodForUser(
    user,
    GET_ALL_RETAILER,
    GET_ALL_MANUFACTURER,
    GET_ALL_CMS
  );
  return axios.get(methodURL);
};

export const getRetailersAllLight = () => {
  const user = getUserFromLocalStorage();
  const methodURL = getMethodForUser(
    user,
    GET_ALL_LIGHT_RETAILER,
    GET_ALL_LIGHT_MANUFACTURER,
    GET_ALL_LIGHT_CMS
  );
  return axios.get(methodURL);
};

export const getRetailersByIds = (retailersIds) => {
  const user = getUserFromLocalStorage();
  const methodURL = getMethodForUser(
    user,
    GET_BY_RETAILERS_IDS_RETAILER,
    GET_BY_RETAILERS_IDS_MANUFACTURER,
    GET_BY_RETAILERS_IDS_CMS
  );
  return axios.get(methodURL, {
    params: {
      retailersIds,
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
};

export const getRetailerByIdCms = (id) =>
  axios.get(`${BASE_URI_CMS}/${id}`);

export const getRetailersWithIcecatIdForCms = () =>
  axios.get(GET_ALL_WITH_ICECAT_ID_FOR_CMS);

export const getRetailersForManufacturer = () =>
  axios.get(`${BASE_URI_MANUFACTURER}/GetAllLightByManufacturer`);

//GROUP SERVICES
export const getGroups = () => axios.get(`${GROUPS_BASE_URI}`);
export const createGroup = (group) => axios.post(`${GROUPS_BASE_URI}`, group);
export const updateGroup = (group) =>
  axios.put(GROUPS_BASE_URI, group, { params: { id: group.id } });

// RETAILER SERVICES
export const getRetailerById = (id) => axios.get(`${RETAILERS_BASE_URI}/${id}`);
export const updateRetailer = (retailer) =>
  axios.put(`${RETAILERS_BASE_URI}`, retailer, { params: { id: retailer.id } });
export const createRetailer = (retailer) =>
  axios.post(`${RETAILERS_BASE_URI}`, retailer);
export const deleteRetailerById = (id) =>
  axios.delete(`${RETAILERS_BASE_URI}/${id}`);

//ENRICHMENT CONFIGURATION SERVICES
export const createEnrichmentConfiguration = (enrichmentConfiguration) =>
  axios.post(`${ENRICHMENT_CONF_BASE_URI}`, enrichmentConfiguration);
export const getEnrichmentConfigurationsByRetailerId = (id) =>
  axios.get(`${ENRICHMENT_CONF_BASE_URI}/GetByRetailerId`, { params: { id } });
export const updateEnrichmentConfiguration = (id, enrichmentConfiguration) =>
  axios.put(`${ENRICHMENT_CONF_BASE_URI}/${id}`, enrichmentConfiguration);
export const deleteEnrichmentConfiguration = (id) =>
  axios.delete(`${ENRICHMENT_CONF_BASE_URI}/${id}`);
