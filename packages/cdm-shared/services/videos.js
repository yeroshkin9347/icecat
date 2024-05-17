import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const SEARCH_VIDEOS_CMS = `${env.CDM_DIGITAL_ASSET_INDEXATION_SERVICE_URI}/api/cms/CmsIndexedDigitalAsset/SearchVideos`;
const SEARCH_MANUFACTURER_DIGITAL_ASSETS = `${env.CDM_DIGITAL_ASSET_INDEXATION_SERVICE_URI}/api/manufacturer/ManufacturerIndexedDigitalAsset`;
const SEARCH_RETAILER_DIGITAL_ASSETS = `${env.CDM_DIGITAL_ASSET_INDEXATION_SERVICE_URI}/api/retailer/RetailerIndexedDigitalAsset`;
const GET_VIDEO_BY_ID = `${env.CDM_IMPORT_RESOURCE_URI}/api/ImportResource/GetVideoMetadatasById`;
const GET_VIDEO_BY_ID_CMS = `${env.CDM_IMPORT_RESOURCE_URI}/public/api/cms/CmsVideoResources/GetVideoById`;
const GET_VIDEO_LANGUAGES_CMS = `${env.CDM_IMPORT_RESOURCE_URI}/public/api/cms/CmsVideoResources/GetVideoLanguages`;
const GET_VIDEO_CENSORS_CMS = `${env.CDM_IMPORT_RESOURCE_URI}/public/api/cms/CmsVideoResources/GetVideoCensors`;
const GET_VIDEO_CATEGORIES_CMS = `${env.CDM_IMPORT_RESOURCE_URI}/public/api/cms/CmsVideoResources/GetVideoCategories`;
const UPDATE_VIDEO_CMS = `${env.CDM_IMPORT_RESOURCE_URI}/public/api/cms/CmsVideoResources/UpdateVideoMetadata`;

const MANUFACTURER_RESOURCES = `${env.CDM_IMPORT_RESOURCE_URI}/api/manufacturer/ManufacturerResources`;
const GET_IMAGE_METADATA_BY_ID = `${MANUFACTURER_RESOURCES}/GetImageMetadataById`;
const GET_VIDEO_METADATA_BY_ID = `${MANUFACTURER_RESOURCES}/GetVideoMetadataById`;
const GET_DOCUMENT_METADATA_BY_ID = `${env.CDM_IMPORT_RESOURCE_URI}/api/manufacturer/ManufacturerResources/GetDocumentMetadataById`;

const RETAILER_RESOURCES = `${env.CDM_IMPORT_RESOURCE_URI}/api/retailer/RetailerResources`;
const GET_RETAILER_IMAGE_METADATA_BY_ID = `${RETAILER_RESOURCES}/GetImageMetadataById`;
const GET_RETAILER_VIDEO_METADATA_BY_ID = `${RETAILER_RESOURCES}/GetVideoMetadataById`;
const GET_RETAILER_DOCUMENT_METADATA_BY_ID = `${RETAILER_RESOURCES}/GetDocumentMetadataById`;

export const searchVideosCms = (PageSize, PageIndex, filters) => {
  return axios.post(
    `${SEARCH_VIDEOS_CMS}`,
    {
      type: "Video",
      ...(filters || {}),
    },
    {
      params: {
        PageIndex,
        PageSize,
      },
    }
  );
};

export const searchManufacturerDigitalAssets = (
  type,
  PageSize,
  PageIndex,
  filters
) => {
  const assetType = `${type[0].toUpperCase()}${type.substring(1).toLowerCase()}s`;
  return axios.post(
    `${SEARCH_MANUFACTURER_DIGITAL_ASSETS}/Search${assetType}`,
    filters,
    {
      params: {
        PageIndex,
        PageSize,
      },
    }
  );
};

export const searchRetailerDigitalAssets = (
  type,
  PageSize,
  PageIndex,
  filters
) => {
  const assetType = `${type[0].toUpperCase()}${type.substring(1).toLowerCase()}s`;
  return axios.post(
    `${SEARCH_RETAILER_DIGITAL_ASSETS}/Search${assetType}`,
    filters,
    {
      params: {
        PageIndex,
        PageSize,
      },
    }
  );
};

export const getVideoById = (videoId) =>
  axios.get(`${GET_VIDEO_BY_ID}`, {
    params: {
      videoId,
    },
  });

export const getVideoByIdCms = (videoId) =>
  axios.get(`${GET_VIDEO_BY_ID_CMS}`, {
    params: {
      videoId,
    },
  });

export const getVideoLanguagesCms = () => axios.get(GET_VIDEO_LANGUAGES_CMS);

export const getVideoCategoriesCms = () => axios.get(GET_VIDEO_CATEGORIES_CMS);

export const getVideoCensorsCms = () => axios.get(GET_VIDEO_CENSORS_CMS);

export const updateVideo = (data) => axios.put(UPDATE_VIDEO_CMS, data);

export const getDigitalAssetStatistics = () =>
  axios.get(`${SEARCH_MANUFACTURER_DIGITAL_ASSETS}/GetStatistics`);

export const getImageMetadataById = (metadataId) =>
  axios.get(GET_IMAGE_METADATA_BY_ID, {
    params: { metadataId },
  });

export const getRetailerImageMetadataById = (metadataId) =>
  axios.get(GET_RETAILER_IMAGE_METADATA_BY_ID, {
    params: { metadataId },
  });

export const getRetailerVideoMetadataById = (metadataId) =>
  axios.get(GET_RETAILER_VIDEO_METADATA_BY_ID, {
    params: { metadataId },
  });

export const getRetailerDocumentMetadataById = (metadataId) =>
  axios.get(GET_RETAILER_DOCUMENT_METADATA_BY_ID, {
    params: { metadataId },
  });

export const getDocumentMetadataById = (metadataId) =>
  axios.get(GET_DOCUMENT_METADATA_BY_ID, {
    params: { metadataId },
  });

export const getVideoMetadataById = (metadataId) =>
  axios.get(GET_VIDEO_METADATA_BY_ID, {
    params: { metadataId },
  });
