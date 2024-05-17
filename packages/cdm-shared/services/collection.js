import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";
import { getMethodForUser } from "../component/messaging/actions";
import { localStorageGetItem } from "../utils/localStorage";

const BASE_URL = `${env.CDM_COLLECTION_SERVICE_URI}/api`;

// MANUFACTURER API
//
export const getCollectionsForManufacturer = () =>
  axios.get(`${BASE_URL}/manufacturer/ManufacturerCollection`);

export const getCollectionDetailForManufacturer = (id) =>
  axios.get(`${BASE_URL}/manufacturer/ManufacturerCollection/GetById`, {
    params: { collectionId: id },
  });

// RETAILER API
//
export const getCollectionsForRetailer = () =>
  axios.get(`${BASE_URL}/retailer/RetailerCollection`);

// CMS API
//
export const getCollectionsForCms = () =>
  axios.get(`${BASE_URL}/cms/CmsCollection`);

export const getManufacturerFeatureToggle = () =>
  axios.get(
    `${env.CDM_SETTING_SERVICE_URI}/api/manufacturer/ManufacturerFeatureFlags/IsFeatureEnabled?featureFlag=EnhancedPricing`
  );

const getUserFromLocalStorage = () => {
  const user = localStorageGetItem("user");
  if (user) return JSON.parse(user);
  return null;
}

export const getCollections = (params) => {
  const user = getUserFromLocalStorage();
  const method = getMethodForUser(
    user,
    getCollectionsForRetailer,
    getCollectionsForManufacturer,
    getCollectionsForCms
  );
  return method(params);
};

export const getEmptyCollectionsPricing = () =>
  axios.get(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/GetEmptyCollectionsForManufacturer`
  );

export const getCollectionsDetail = (params) =>
  axios.get(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/GetGroupValuesByCollectionPagedFiltered`,
    {
      params,
    }
  );

export const getCollectionsExportAction = () =>
  axios.get(
    `${BASE_URL}/manufacturer/ManufacturerCollectionPricing/GetExportActionId`
  );

export const importCollectionPricing = (
  collectionCode,
  manufacturerEntityId,
  file
) => {
  var formData = new FormData();
  formData.append("file", file);
  return axios.post(
    `${env.CDM_IMPORT_SERVICE_URI}/api/manufacturer/manufacturerimport/ImportCollectionPricing`,
    formData,
    {
      params: {
        collectionCode,
        manufacturerEntityId,
      },
    }
  );
};

export const getUpdatedImportManufacturerEntityId = () =>
  axios.get(
    `${BASE_URL}/manufacturer/ManufacturerCollectionPricing/GetUpdatedImportManufacturerEntityId`
  );

export const duplicateCollection = (
  sourceCollectionId,
  destinationCollectionId
) => {
  return axios.post(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/DuplicateCollection`,
    undefined,
    {
      params: {
        sourceCollectionId,
        destinationCollectionId,
      },
    }
  );
};

export const deleteCollectionPricings = (collectionId, collectionIds) => {
  return axios.delete(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/RemoveCollectionInGroupValuesByIds`,
    {
      params: { collectionId },
      data: collectionIds,
    }
  );
};

export const deleteCollectionPricing = (collectionId) => {
  return axios.delete(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/RemoveCollectionInGroupValuesByManufacturer`,
    {
      params: {
        collectionId,
      },
    }
  );
};

export const updateBulkPropertyForGroupValues = (payload) => {
  return axios.put(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/BulkUpdatePropertyForGroupValues`,
    payload
  );
};

export const updateGroupValues = (payload) => {
  return axios.put(
    `${env.CDM_STORAGE_SERVICE_URI}/api/manufacturer/ManufacturerGroupValues/SaveGroupValues`,
    payload
  );
};
