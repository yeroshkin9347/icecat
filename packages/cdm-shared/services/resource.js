import axios from "axios";
import * as env from "cdm-shared/environment";
import upperFirst from "lodash/upperFirst";
import { getMethodForUser } from "../component/messaging/actions";
import { localStorageGetItem } from "../utils/localStorage";

// Set the services URIs
//
const getUserFromLocalStorage = () => {
  const user = localStorageGetItem("user");
  if (user) return JSON.parse(user);
  return null;
}
const user = getUserFromLocalStorage();
const IMPORT_RESOURCE_RETAILER = `${env.CDM_IMPORT_RESOURCE_URI}/api/retailer/RetailerImportResources`;
const IMPORT_RESOURCE_MANUFACTURER = `${env.CDM_IMPORT_RESOURCE_URI}/api/manufacturer/ManufacturerImportResources`;

const IMPORT_RESOURCE_URL = getMethodForUser(
  user,
  IMPORT_RESOURCE_RETAILER,
  IMPORT_RESOURCE_MANUFACTURER,
  IMPORT_RESOURCE_MANUFACTURER
);

const IMPORT_RESOURCE_IMAGE_URL = `${IMPORT_RESOURCE_URL}/UploadImage`;
const UPDATE_RESOURCE_IMAGE_URL = `${IMPORT_RESOURCE_URL}/UpdateImageMetadata`;
const IMPORT_DOCUMENT_RESOURCE_URL = `${IMPORT_RESOURCE_URL}/ImportDocumentResource`;
const UPDATE_RESOURCE_DOCUMENT_URL = `${IMPORT_RESOURCE_URL}/UpdateDocumentMetadata`;
const IMPORT_RESOURCE_VIDEO_URL = `${IMPORT_RESOURCE_URL}/UploadVideo`;
const UPDATE_RESOURCE_VIDEO_URL = `${IMPORT_RESOURCE_URL}/UpdateVideoMetadata`;
const DELETE_RESOURCE_METADATA_URL = `${IMPORT_RESOURCE_URL}/DeleteMetadataMany`;
const GET_VIDEOS_BY_TRADE_ITEM_ID = `${IMPORT_RESOURCE_URL}/GetVideosByTradeItemId`;

const GET_ASSET_TAGS = `${env.CDM_IMPORT_RESOURCE_URI}/api/assetTags/getAll`;
const IMPORT_RESOURCE = `${env.CDM_IMPORT_RESOURCE_URI}/api/ImportResource`;
const IMPORT_IMAGE_RESOURCE = `${IMPORT_RESOURCE}/UploadImage`;
const IMPORT_DOCUMENT_RESOURCE = `${IMPORT_RESOURCE}/ImportDocumentResource`;
const UPDATE_IMAGE_RESOURCE = `${IMPORT_RESOURCE}/UpdateImageMetadata`;
const UPDATE_DOCUMENT_RESOURCE = `${IMPORT_RESOURCE}/UpdateDocumentMetadata`;
const GET_DOCUMENT_RESOURCES_BY_TRADE_ITEM = `${IMPORT_RESOURCE}/GetDocumentsByTradeItemId`;
const GET_IMAGE_CATEGORIES = `${IMPORT_RESOURCE}/GetImageCategories`;
const GET_FACING_TYPES = `${IMPORT_RESOURCE}/GetFacingTypes`;
const GET_PLUNGE_ANGLES = `${IMPORT_RESOURCE}/GetPlungeAngles`;


export const getVideosByTradeItemId = (tradeItemId) => {
  return axios.get(`${GET_VIDEOS_BY_TRADE_ITEM_ID}`, {
    params: {
      tradeItemId,
    },
  });
};

// Get image resources
//
export const getImagesResourcesForTradeItem = tradeItemId =>
  axios.get(`${IMPORT_RESOURCE}`, {
    params: {
      tradeItemId
    }
  });

// Get image resources
//
export const getDocumentsResourcesForTradeItem = tradeItemId =>
  axios.get(`${GET_DOCUMENT_RESOURCES_BY_TRADE_ITEM}`, {
    params: {
      tradeItemId
    }
  });

// Get image categories
//
export const getImageCategories = () =>
  axios.get(`${GET_IMAGE_CATEGORIES}`);

// Get facing types
//
export const getFacingTypes = () =>
  axios.get(`${GET_FACING_TYPES}`);

// Get image categories
//
export const getPlungeAngles = () =>
  axios.get(`${GET_PLUNGE_ANGLES}`);

// Delete resource
//
export const deleteResource = metadataId =>
  axios.delete(`${IMPORT_RESOURCE}`, {
    params: {
      metadataId
    }
  });

// Import image resource
//
export const importImageResource = (imageMetadata, file, channel = {}) => {
  const fileData = new FormData();
  fileData.append("Image", file);
  fileData.append("fileName", file.name);

  // Channel metadata
  fileData.append("StartDate", channel.startDate);
  fileData.append("EndDate", channel.endDate);
  fileData.append("TargetMarketIds", channel.targetMarketIds);
  fileData.append("RetailerIds", channel.retailerIds);

  const uppercaseImageMetadata = {};
  Object.keys(imageMetadata).forEach(k => {
    if (imageMetadata[k]) {
      uppercaseImageMetadata[upperFirst(k)] = imageMetadata[k];
    }
  })

  return axios.post(IMPORT_IMAGE_RESOURCE, fileData, {
    params: { ...uppercaseImageMetadata }
  });
};

export const importImageResourceForUser = (imageMetadata, file) => {
  const formData = new FormData();
  formData.append('Image', file);
  return axios.post(`${IMPORT_RESOURCE_IMAGE_URL}`, formData, {
    params: imageMetadata,
  });
};

export const deleteResourceForUser = (metadataId) => {
  return axios.request({ method: "delete", url: IMPORT_RESOURCE_URL, params: { metadataId } } );
};

export const deleteResourceMetadataForUser = (metadataIds) => {
  return axios.request({ method: "delete", url: DELETE_RESOURCE_METADATA_URL, data: metadataIds } );
};

export const updateImageResourceForUser = (imageMetadata) => {
  return axios.put(UPDATE_RESOURCE_IMAGE_URL, imageMetadata);
};

// Import document resource
//
export const importDocumentResource = (documentMetadata, file) => {
  const fileData = new FormData();
  fileData.append("Document", file);
  fileData.append("fileName", file.name);

  return axios.post(IMPORT_DOCUMENT_RESOURCE, fileData, {
    params: { ...documentMetadata }
  });
};

/**
 * @typedef {"PACKSHOT_RECTO" | "PACKSHOT_VERSO" | "PACKSHOT_RECTO_MULTILANG" | "SCREENSHOT" | "AFFICHE" | "LOGO" | "PACKAGE_RECTO" | "PACKAGE_VERSO" | "ENTIRE_TOY" | "TOY_WITH_KID" | "TOY_IN_SITUATION" | "OTHERS" | "OUT_OF_BOX" | "IN_SITUATION" | "PREORDER_BONUS" | "DOCUMENT" | "OLD" | "CERTIFICATIONS" | "UNDEFINED" | "NOT_EXPORTABLE" | "NOT_DEFINITIVE" | "ASSEMBLY_NOTE" | "GAME_RULE" | "WARNING" | "SALES_BROCHURE" | "LOGISTIC" | "STANDARD" | "PATENT" | "INNER_PACK" | "STAGED" | "HELD" | "WORN" | "FAMILY" | "OPEN_CASE" | "CE_MARKING" | "ENERGY_LABEL" | "EU_ENERGY_LABEL" | "EU_PRODUCT_FICHE" | "PRODUCT_STORY" | "REPAIRABILITY_INDEX_OVERVIEW" | "SAFETY_DATA_SHEET" | "SIZE_CHART" | "AWARD"} DocumentCategory
 * */
/**
 * @typedef {Object} DocumentMetadata
 * @property {String | undefined} TradeItemId
 * @property {String | undefined} FileName
 * @property {Number} Index
 * @property {DocumentCategory} DocumentCategory
 * @property {Array<String>} LanguageCodes
 * @property {Array<String>} RetailerCodes
 * @property {Boolean} NotDefinitive
 * @property {Boolean} NotExportable
 * @property {Boolean} Old
 * */

// Import image resource
/**
 * @param {DocumentMetadata} documentMetadata
 * @param {File} file
 * */
export const importDocumentResourceForUser = (documentMetadata, file) => {
  const fileData = new FormData();
  fileData.append("Document", file);
  fileData.append("fileName", file.name);

  return axios.post(IMPORT_DOCUMENT_RESOURCE_URL, fileData, {
    params: { ...documentMetadata }
  });
};

export const importVideoResourceForUser = (documentMetadata, file) => {
  const fileData = new FormData();
  fileData.append("Data", file);
  fileData.append("fileName", file.name);

  return axios.post(IMPORT_RESOURCE_VIDEO_URL, fileData, {
    params: { ...documentMetadata }
  });
};

export const updateVideoResourceForUser = (imageMetadata) => {
  return axios.put(UPDATE_RESOURCE_VIDEO_URL, imageMetadata);
};

// Update image metadata
export const updateImageResource = imageMetadata =>
  axios.put(`${UPDATE_IMAGE_RESOURCE}`, { ...imageMetadata });

// Update document metadata
export const updateDocumentResource = documentMetadata =>
  axios.put(`${UPDATE_DOCUMENT_RESOURCE}`, { ...documentMetadata });

export const updateDocumentResourceForUser = (documentMetadata) => {
  return axios.put(UPDATE_RESOURCE_DOCUMENT_URL, documentMetadata);
};

export const getAssetTags = () => axios.get(`${GET_ASSET_TAGS}`);
