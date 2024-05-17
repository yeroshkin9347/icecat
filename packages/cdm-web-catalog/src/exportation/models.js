import { getManufacturerId } from "cdm-shared/redux/hoc/withUser";

const defaultFilters = user => {
  return {
    tradeItemId: null,
    exportPreComputedTradeItemActionId: null,
    retailerIds: null,
    exportPreComputedTradeItemActionIds: null,
    manufacturerIds: [getManufacturerId(user)],
    title: null,
    scope: null,
    exportLanguageCode: null,
    gtin: null,
    tradeItemManufacturerCode: null,
    numberOfImagesMin: null,
    numberOfImagesMax: null,
    exportedTimestampFrom: null,
    exportedTimestampTo: null
  };
};

export { defaultFilters, EXPORT_BY_GTINS, EXPORT_BY_TRADE_ITEM_MAN_CODE };
