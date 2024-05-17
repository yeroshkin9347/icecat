import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const BASE_PROPERTIES = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}`;
const GET_PROPERTY_GROUPS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsPropertyGroup`;
const GET_FOR_FORM_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_MANUFACTURER = `${BASE_PROPERTIES}/api/manufacturer/ManufacturerTradeItemProperties/GetPropertyForTradeItemForm`;
const GET_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_RETAILER = `${BASE_PROPERTIES}/api/TradeItemProperties/GetByPropertyCategoryAndGroup`;
const GET_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP = `${BASE_PROPERTIES}/api/manufacturer/ManufacturerTradeItemProperties/GetPropertyByCategoryAndGroup`;

const GET_FOR_FORM_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_CMS = `${BASE_PROPERTIES}/api/cms/CmsTradeItemProperties/GetForTradeItemForm`;

const GET_PROPERTY_VALUES_BY_PROPERTY_CODE = `${BASE_PROPERTIES}/api/manufacturer/ManufacturerTradeItemProperties/GetByPropertyCode`;
const GET_PROPERTY_VALUES_BY_PROPERTY_CODES = `${BASE_PROPERTIES}/api/manufacturer/ManufacturerTradeItemProperties/GetByPropertyCodes`;
const GET_PROPERTIES_FOR_RETAILER = `${BASE_PROPERTIES}/api/PropertyRetailerAssociation/GetByRetailerId`;
const GET_PROPERTIES_BY_IDS = `${BASE_PROPERTIES}/api/TradeItemProperties/GetLightByIds`;
const PROPERTIES_ASSOCIATIONS = `${BASE_PROPERTIES}/api/PropertyRetailerAssociation`;
const GET_PROPERTY_FAMILY = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/manufacturer/ManufacturerPropertyFamily/GetByIds`;

const GET_TRADE_ITEM_PROPETIES_LIGHT_UP_AND_DOWN_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID = `${BASE_PROPERTIES}/api/TradeItemProperties/GetLightUpAndDownByTradeItemCategoryAndPropertyGroupId`;
const GET_VALUES_GROUPS_BY_IDS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/manufacturer/ManufacturerValuesGroup/GetGroupValuesByIdsAndCategoryCode`;
const GET_VALUES_GROUPS_BY_IDS_CMS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsValuesGroup/GetGroupValuesByIdsAndCategoryCode`;
const GET_VALUES_GROUPS_BY_ID = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/manufacturer/ManufacturerValuesGroup/GetGroupValuesById`;
const GET_VALUES_CMS_GROUPS_BY_ID = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsValuesGroup/GetGroupValuesById`;
const GET_CALCULATED_PROPERTIES = `${env.CDM_STORAGE_SERVICE_URI}/api/ManufacturerCatalog/GetCalculatedPropertiesValues`;
const GET_CALCULATED_PROPERTIES_CMS = `${env.CDM_STORAGE_SERVICE_URI}/api/v2/Cms/GetCalculatedPropertiesValues`;
const GET_VALUESGROUP_VALUESCODE_CMS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsValuesGroup/GetValuesGroupValueByValueCode`;
const GET_VALUESGROUP_VALUESCODE = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/manufacturer/ManufacturerValuesGroup/GetValuesGroupValueByValueCode`;

const GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_CODE = `${BASE_PROPERTIES}/api/cms/CmsTradeItemProperties/GetLightByPropertyCategoryAndGroup`;


export const getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupCodeAndTradeItemCategoryCode = (
  taxonomyId,
  propertyGroupCode,
  tradeItemCategoryCode
) => {
  const getUrl = () => {
    if (taxonomyId && propertyGroupCode && tradeItemCategoryCode)
      return GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_CODE;
    return undefined;
  };
  let url = getUrl();
  if (!url)
    return Promise.reject(
      "Missing both propertyGroupCode and propertyTradeItemCategoryCode arguments"
    );
  return axios.get(url, { params: { taxonomyId, tradeItemCategoryCode, propertyGroupCode } });
};


export const getPropertyFamilyByIds = propertyFamilyIds =>
  axios.post(`${GET_PROPERTY_FAMILY}`, propertyFamilyIds);


export const getValuesByPropertyCode = (taxonomyId, propertyCode) =>
  axios.get(`${GET_PROPERTY_VALUES_BY_PROPERTY_CODE}`, {
    params: {
      taxonomyId,
      propertyCode
    }
  });

export const getValuesByPropertyCodes = (taxonomyId, languageCode, propertyCodes) =>
  axios.post(`${GET_PROPERTY_VALUES_BY_PROPERTY_CODES}`, propertyCodes, {
    params: {
      taxonomyId,
      languageCode
    }
  });

  
export const getTradeItemPropertiesLightUpAndDownByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode =
  ({ taxonomyId, propertyGroupId, tradeItemCategoryCode }) => {
    const getUrl = () => {
      if (taxonomyId && propertyGroupId && tradeItemCategoryCode)
        return GET_TRADE_ITEM_PROPETIES_LIGHT_UP_AND_DOWN_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID;
      return undefined;
    };
    let url = getUrl();
    if (!url)
      return Promise.reject(
        "Missing both propertyGroupId and propertyTradeItemCategoryCode arguments"
      );
    return axios.get(url, {
      params: { taxonomyId, tradeItemCategoryCode, propertyGroupId },
    });
  };

// Get values groups
//
export const getGroupsValuesByIds = (groupValuesIds, tradeItemCategoryCode) =>
  axios
    .get(`${GET_VALUES_GROUPS_BY_IDS}`, {
      params: {
        tradeItemCategoryCode,
        groupValuesIds
      }
    });
export const getGroupsValuesByIdsCMS = (groupValuesIds, tradeItemCategoryCode, manufacturerId) =>
  axios
    .get(`${GET_VALUES_GROUPS_BY_IDS_CMS}`, {
      params: {
        tradeItemCategoryCode,
        groupValuesIds,
        ManufacturerId: manufacturerId
      }
    });

export const getCalculatedValues = (tradeItemId, propertyCode, tradeItem, queryParams = {}) =>
  axios.put(`${GET_CALCULATED_PROPERTIES}/${tradeItemId}/${propertyCode}`, tradeItem, { params: queryParams })

export const getCalculatedValuesCMS = (tradeItemId, propertyCode, tradeItem, queryParams = {}) =>
  axios.put(`${GET_CALCULATED_PROPERTIES_CMS}/${tradeItemId}/${propertyCode}`, tradeItem, { params: queryParams })

// Get values groups
//
export const getGroupsValuesById = (groupValuesId) =>
  axios
    .get(`${GET_VALUES_GROUPS_BY_ID}/${groupValuesId}`);

export const getGroupsValuesByIdCms = (groupValuesId) =>
  axios
    .get(`${GET_VALUES_CMS_GROUPS_BY_ID}/${groupValuesId}`);

// Get all the groups
//
export const getPropertyGroups = () => axios.get(`${GET_PROPERTY_GROUPS}`);


export const getForFormByTradeItemCategoryAndGroupForManufacturer = (
  taxonomyId,
  tradeItemCategoryCode,
  propertyGroupCode,
  languageCode
) =>
  axios.get(`${GET_FOR_FORM_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_MANUFACTURER}/${taxonomyId}/${tradeItemCategoryCode}/${propertyGroupCode}/${languageCode}`);


export const getForFormByTradeItemCategoryAndGroupForCMS = (
  taxonomyId,
  tradeItemCategoryCode,
  propertyGroupCode,
  languageCode
) =>
  axios.get(`${GET_FOR_FORM_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_CMS}/${taxonomyId}/${tradeItemCategoryCode}/${propertyGroupCode}/${languageCode}`);

// Get by tradeItemCategory and group
//
export const getByTradeItemCategoryAndGroup = (taxonomyId, tradeItemCategoryCode, propertyGroupCode) => {
  return axios.get(`${GET_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP}`, {
    params: {
      taxonomyId,
      tradeItemCategoryCode,
      propertyGroupCode
    }
  })
};

export const getByTradeItemCategoryAndGroupForRetailer = (taxonomyId, tradeItemCategoryCode, propertyGroupCode) => {
  return axios.get(`${GET_PROPERTIES_BY_TRADE_ITEM_CATEGORY_AND_GROUP_FOR_RETAILER}`, {
    params: {
      taxonomyId,
      tradeItemCategoryCode,
      propertyGroupCode
    }
  })
};


// Get properties for a given retailer
//
export const getPropertiesForRetailer = retailerId =>
  axios.get(`${GET_PROPERTIES_FOR_RETAILER}`, {
    params: {
      retailerId
    }
  });

// Get properties by ids
//
export const getPropertiesByIds = propertiesIds =>
  axios.post(`${GET_PROPERTIES_BY_IDS}`, propertiesIds || []);

// Get detailed associations by ids
//
export const getDetailedAssociationsByIds = ids =>
  axios.post(`${PROPERTIES_ASSOCIATIONS}/GetDetailedByIds`, ids || []);

export const getValuesGroupByValueCodeRequest = (data) => {
  return axios.post(`${GET_VALUESGROUP_VALUESCODE}`, data);
};

export const getValuesGroupByValueCodeCMSRequest = (data, manufacturerId) => {
  return axios.post(`${GET_VALUESGROUP_VALUESCODE_CMS}`, data, {
    params: {
      manufacturerId: manufacturerId
    }
  });
};

