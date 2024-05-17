import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const BASE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/cms`;
const BASE_API_URI = `${env.CDM_USER_URI}/api`;
const CONNECTORS_URI = `${BASE_URI}/connector`;
const MANUFACTURER_BASE_URI = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/manufacturer/Manufacturer`;
const MANUFACTURER_BASE_URI_CMS = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/cms/Manufacturer`;
const MANUFACTURER_ENTITIES_BASE_URI = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/cms/ManufacturerEntity`;
const MANUFACTURER_ENTITIES_BASE_URI_CATALOG = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/Manufacturer/ManufacturerEntity`;
const CDM_USER_MANAGEMENT_INTERNAL = `${BASE_API_URI}/Internal`;
const MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID = `${MANUFACTURER_ENTITIES_BASE_URI}/GetByManufacturerId`;
const MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID_CATALOG = `${MANUFACTURER_ENTITIES_BASE_URI_CATALOG}/GetByManufacturerId`;
const CDM_USER_MANAGEMENT_USER = `${BASE_API_URI}/User`;

export const getManufacturerEntitiesByManufacturerId = manufacturerId =>
  axios.get(
    `${MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID}/${manufacturerId}`
  );

export const getManufacturerEntitiesByManufacturerIdCatalog = manufacturerId =>
  axios.get(
    `${MANUFACTURER_ENTITIES_GET_BY_MANUFACTURER_ID_CATALOG}/${manufacturerId}`
  );

// export const getManufacturerRetailerNetwork = manufacturerId => axios.get(`${MANUFACTURER_GET_RETAILER_NETWORK}/${manufacturerId}`)

export const getAllManufacturers = () =>
  axios.get(`${MANUFACTURER_BASE_URI}/GetLight`);

// CMS API
//
export const cmsGetManufacturerEntitiesLight = () =>
  axios.get(`${MANUFACTURER_ENTITIES_BASE_URI}`);


// Get all manufacturers
//
export const getManufacturers = () => axios.get(`${MANUFACTURER_BASE_URI}`);
export const getManufacturersCms = () => axios.get(`${MANUFACTURER_BASE_URI_CMS}`);

export const getAllConnectors = () => axios.get(`${CONNECTORS_URI}/light`);

// Get all users
//
export const getAllUsersByManufacturerId = manufacturerId => axios.get(`${CDM_USER_MANAGEMENT_INTERNAL}/GetByManufacturerId/${manufacturerId}`)
// Get all users
//
export const getAllUsers = () => axios.get(`${CDM_USER_MANAGEMENT_USER}/all`)
// Delete a manufacturer entity
//
export const deleteManufacturerEntityById = (id) => axios.delete(`${MANUFACTURER_ENTITIES_BASE_URI}/${id}`)

// MANUFACTURER SERVICES
export const getManufacturerById = (id) => axios.get(`${MANUFACTURER_BASE_URI}/${id}`);
export const saveManufacturerById = (id, manufacturer) => axios.put(`${MANUFACTURER_BASE_URI}/${id}`, manufacturer);
export const createManufacturer = (manufacturer) => axios.post(`${MANUFACTURER_BASE_URI}`, manufacturer);
export const deleteManufacturerById = (id) => axios.delete(`${MANUFACTURER_BASE_URI}/${id}`);

export const createManufacturerEntity = (manufacturerEntity) => axios.post(`${MANUFACTURER_ENTITIES_BASE_URI_CATALOG}`, manufacturerEntity)
export const saveManufacturerEntityById = (id, manufacturerEntity) => axios.put(`${MANUFACTURER_ENTITIES_BASE_URI_CATALOG}/${id}`, manufacturerEntity)
export const checkExistingManufacturerEntityName = (name) => axios.get(`${MANUFACTURER_ENTITIES_BASE_URI_CATALOG}/CheckValidManufacturerEntityName`, {
  params: {
    manufacturerEntityName: name,
  }
})
