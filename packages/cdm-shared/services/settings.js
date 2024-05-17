import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const GET_MANUFACTURER_NAMING_CONVENTIONS = `${env.CDM_SETTING_SERVICE_URI}/api/manufacturer/ManufacturerNamingConvention`;
const GET_RETAILER_NAMING_CONVENTIONS = `${env.CDM_SETTING_SERVICE_URI}/api/retailer/RetailerNamingConvention`;

export const getManufacturerNamingConventions = (scope) => {
  return axios.get(`${GET_MANUFACTURER_NAMING_CONVENTIONS}/${scope}`);
};

export const getRetailerNamingConventions = (scope) => {
  return axios.get(`${GET_RETAILER_NAMING_CONVENTIONS}/${scope}`);
};
