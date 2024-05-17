import { cloneDeep, get } from "lodash";
import moment from "moment";

export function rangeDateOverlap(start1, end1, start2, end2) {
  const gran = "day";
  const inc = "[]";
  const startFirst = start1.isBetween(start2, end2, gran, inc);
  const endFirst = end1.isBetween(start2, end2, gran, inc);
  const startLast = start2.isBetween(start1, end1, gran, inc);
  const endLast = end2.isBetween(start1, end1, gran, inc);

  return startFirst || endFirst || startLast || endLast;
}

export const enrichPriceDataWithTariffOverlap = (pricesData) => {
  return cloneDeep(pricesData).map((price) => {
    const retailerIds = get(price, "retailerIds", []);
    const isTariffWarned = retailerIds.some((retailerId) => {
      const pricesDataHasTheSameRetailerId = pricesData.filter((priceData) => (
        priceData.id !== price.id &&
        priceData.ean === price.ean &&
        priceData.manufacturer_reference === price.manufacturer_reference &&
        priceData.retailerIds.includes(retailerId)
      ));

      return pricesDataHasTheSameRetailerId.some((priceData) => {
        return rangeDateOverlap(
          moment(priceData.original_start_date),
          moment(priceData.original_end_date),
          moment(price.original_start_date),
          moment(price.original_end_date)
        );
      });
    });

    return {
      ...price,
      isTariffWarned,
    };
  });
};

export const isImportJobDone = (importJob) => {
  return !!importJob && !!importJob.endTimestamp;
};
