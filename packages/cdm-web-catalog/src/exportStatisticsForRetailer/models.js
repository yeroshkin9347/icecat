import { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import { date } from "cdm-shared/utils/date";

const defaultFilters = user => {
  return {
    tradeItemId: null,
    exportPreComputedTradeItemActionId: null,
    retailerId: getManufacturerId(user),
    exportPreComputedTradeItemActionIds: null,
    manufacturer: null,
    retailerCode: null,
    title: null,
    scope: null,
    exportLanguageCode: null,
    gtin: null,
    tradeItemManufacturerCode: null,
    numberOfImagesMin: null,
    numberOfImagesMax: null,
    exportedTimestampFrom: date()
      .subtract(1, "month")
      .format("YYYY-MM-DD"),
    exportedTimestampTo: null
  };
};

export { defaultFilters };