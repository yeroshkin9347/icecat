import map from "lodash/map";
import get from "lodash/get";
import reduce from "lodash/reduce";
import {
  getForFormByTradeItemCategoryAndGroupForManufacturer,
  getGroupsValuesByIds,
  getGroupsValuesByIdsCMS,
  getGroupsValuesById,
  getGroupsValuesByIdCms,
  getPropertyFamilyByIds,
  getForFormByTradeItemCategoryAndGroupForCMS,
  getByTradeItemCategoryAndGroupForRetailer
} from "cdm-shared/services/tradeItemProperties";
import {
  getTargetMarkets,
  getLanguages
} from "cdm-shared/services/targetMarket";
import {
  getTradeItemForManufacturer,
  manufacturerUpdateTradeItem,
  manufacturerCreateTradeItem,
  cmsGetTradeItem,
  cmsCreateTradeItem,
  cmsUpdateTradeItem,
  getRetailerTradeItem
} from "cdm-shared/services/product";
import {
  getImagesResourcesForTradeItem,
  updateImageResource,
  getDocumentsResourcesForTradeItem,
  deleteResource,
  importImageResource,
  importDocumentResource,
  updateDocumentResource
} from "cdm-shared/services/resource";
import { isRetailer, isManufacturer } from "cdm-shared/redux/hoc/withAuth";

let tradeItemProperties = [];

let groupValues = [];

const getMethodForUser = (
  user,
  retailerMethod,
  manufacturerMethod,
  cmsMethod
) => {
  if (isRetailer(user)) return retailerMethod;
  else if (isManufacturer(user)) return manufacturerMethod;
  else return cmsMethod;
};

export const getTradeItemProperties = (taxonomyId, code, group, languageCode) => {
  const cacheTradeItemProperties = getCacheTradeItemProperties(taxonomyId, code, group);
  if (cacheTradeItemProperties) {
    return Promise.resolve({ data: cacheTradeItemProperties.properties });
  }
  return getForFormByTradeItemCategoryAndGroupForManufacturer(taxonomyId, code, group, languageCode);
};

export const getTradeItemPropertiesForRetailer = (taxonomyId, code, group) => {
  const cacheTradeItemProperties = getCacheTradeItemProperties(taxonomyId, code, group);
  if (cacheTradeItemProperties) {
    return Promise.resolve({ data: cacheTradeItemProperties.properties });
  }
  return getByTradeItemCategoryAndGroupForRetailer(taxonomyId, code, group);
};

export const getTradeItemPropertiesForCMS = (taxonomyId, code, group) => {
  const cacheTradeItemProperties = getCacheTradeItemProperties(taxonomyId, code, group);
  if (cacheTradeItemProperties) {
    return Promise.resolve({ data: cacheTradeItemProperties.properties });
  }
  return getForFormByTradeItemCategoryAndGroupForCMS(taxonomyId, code, group, "en-GB");
};

export const getGroupsValues = (ids, tradeItemCategoryCode) => {
  const cacheGroupValues = getCacheGroupValues(ids, tradeItemCategoryCode);
  if (cacheGroupValues) {
    return Promise.resolve({ data: cacheGroupValues.data });
  }
  return getGroupsValuesByIds(ids, tradeItemCategoryCode);
};
export const getGroupsValuesCMS = (ids, tradeItemCategoryCode, manufacturerId) => {
  const cacheGroupValues = getCacheGroupValues(ids, tradeItemCategoryCode);
  if (cacheGroupValues) {
    return Promise.resolve({ data: cacheGroupValues.data });
  }
  return getGroupsValuesByIdsCMS(ids, tradeItemCategoryCode, manufacturerId);
};

export const getAllTargetMarkets = () => getTargetMarkets();

export const getAllLanguages = () =>
  getLanguages().then(res => map(get(res, "data", []), l => get(l, "code")));

export const getTradeItem = user => (tradeItemId, locale) => {
  const method = getMethodForUser(
    user,
    getRetailerTradeItem,
    getTradeItemForManufacturer,
    cmsGetTradeItem
  );
  return method(tradeItemId, locale);
};

export const getImagesResources = tradeItemId =>
  getImagesResourcesForTradeItem(tradeItemId);

export const getDocumentsResources = tradeItemId =>
  getDocumentsResourcesForTradeItem(tradeItemId);

export const getResources = tradeItemId =>
  Promise.all([
    getImagesResources(tradeItemId),
    getDocumentsResources(tradeItemId)
  ]).then(promisesValues => {
    return reduce(
      promisesValues,
      (result, promiseValue, key) => {
        result = [...result, ...get(promiseValue, "data", [])];
        return result;
      },
      []
    );
  });

export const updateImageMetadata = imageMetadata =>
  updateImageResource(imageMetadata);

export const updateDocumentMetadata = documentMetadata =>
  updateDocumentResource(documentMetadata);

export const createTradeItem = user => (tradeItem, manufacturerId) => {
  const method = getMethodForUser(user, null, manufacturerCreateTradeItem, ti =>
    cmsCreateTradeItem(ti, manufacturerId)
  );
  return method(tradeItem);
};

export const updateTradeItem = user => tradeItem => {
  const method = getMethodForUser(
    user,
    null,
    manufacturerUpdateTradeItem,
    cmsUpdateTradeItem
  );
  return method(tradeItem);
};

export const saveTradeItemProperties = (taxonomyId, tradeItemCategoryCode, propertyGroupCode, properties) => {
  const newTradeItemProperties = tradeItemProperties.filter(item =>
    !(item.taxonomyId === taxonomyId && item.tradeItemCategoryCode === tradeItemCategoryCode && item.propertyGroupCode === propertyGroupCode)
  );
  tradeItemProperties = [
    ...newTradeItemProperties,
    {
      taxonomyId,
      tradeItemCategoryCode,
      propertyGroupCode,
      properties
    }
  ];
};

export const getCacheGroupValues = (ids, tradeItemCategoryCode) => {
  const groupValue = groupValues.find(item =>
    item.ids === JSON.stringify(ids) && item.tradeItemCategoryCode === tradeItemCategoryCode
  );
  return groupValue;
};

export const saveGroupValues = (ids, tradeItemCategoryCode, data) => {
  const newGroupValue = groupValues.filter(item =>
    !(item.ids === JSON.stringify(ids) && item.tradeItemCategoryCode === tradeItemCategoryCode)
  );
  groupValues = [
    ...newGroupValue,
    {
      ids: JSON.stringify(ids),
      tradeItemCategoryCode,
      data
    }
  ];
};

export const getCacheTradeItemProperties = (taxonomyId, tradeItemCategoryCode, propertyGroupCode) => {
  const tradeItemProperty = tradeItemProperties.find(item =>
    item.taxonomyId === taxonomyId && item.tradeItemCategoryCode === tradeItemCategoryCode && item.propertyGroupCode === propertyGroupCode
  );
  return tradeItemProperty;
};

export const getEditions = () => getGroupsValuesById("39dbf902-c0f3-408f-be38-f54f2eb1097b");

export const getEditionsCMS = () => getGroupsValuesByIdCms("39dbf902-c0f3-408f-be38-f54f2eb1097b");

export const getPlatforms = () => getGroupsValuesById("96c773c0-89df-4316-8d21-01a7be4d6767");

export const getPlatformsCMS = () => getGroupsValuesByIdCms("96c773c0-89df-4316-8d21-01a7be4d6767");

export { deleteResource, importImageResource, importDocumentResource };

export const getAllPropertyFamilyByIds = propertyFamilyIds =>
  getPropertyFamilyByIds(propertyFamilyIds);
