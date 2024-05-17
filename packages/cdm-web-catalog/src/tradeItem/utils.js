import get from "lodash/get";
import orderBy from "lodash/orderBy";
import map from "lodash/map";
import moment from "moment";

const isConsistent = (tradeItem) =>
  get(tradeItem, "consistencyStatus") !== "NotConsistent";

const getImageResourceMetadatasFromTradeItem = (
  tradeItem,
  isRetailer = false
) => {
  const imageResourceMetadatas = orderBy(
    map(get(tradeItem, "imageResourceMetadatas", []), (imageMetadata) =>
      get(imageMetadata, "values", [])
    )
      .flat()
      .filter((img) =>
        isRetailer ? !img.notDefinitive && !img.notExportable : true
      ),
    "index",
    "asc"
  );
  return imageResourceMetadatas;
};

const filterCatalogPricesForRetailer = (pricesData) => {
  const catalogPricesGroupByPeriod = pricesData.reduce((acc, item) => {
    const startDateKey = item.startDate
      ? moment(item.startDate).format("YYYY-MM-DD")
      : "";
    const endDateKey = item.endDate
      ? moment(item.endDate).format("YYYY-MM-DD")
      : "";
    const key = `${startDateKey}${endDateKey}`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return Object.keys(catalogPricesGroupByPeriod)
    .map((key) => {
      const itemsSamePeriod = catalogPricesGroupByPeriod[key];

      if (!key) {
        return itemsSamePeriod;
      }

      const itemsHasRetailer = itemsSamePeriod.filter(
        (item) => item.retailerIds.length > 0
      );
      if (itemsHasRetailer.length > 0) {
        return itemsHasRetailer;
      }

      const itemsGlobal = itemsSamePeriod.filter(
        (item) => item.retailerIds.length === 0
      );
      return itemsGlobal;
    })
    .flat();
};

export {
  isConsistent,
  getImageResourceMetadatasFromTradeItem,
  filterCatalogPricesForRetailer,
};
