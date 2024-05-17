import map_75_41473 from "./75_41473_map.json";

export const sortVariants = (variants) => {
  variants.sort((a, b) => {
    const aValue = a.options["75"] ? a.parentsTradeItemIds[0] : a.tradeItemId;
    const bValue = b.options["75"] ? b.parentsTradeItemIds[0] : b.tradeItemId;
    if (aValue === bValue) {
      if (!a.options["75"]) return -1;
      if (!b.options["75"]) return 1;

      if (a.options["75"] > b.options["75"]) {
        return 1;
      }

      if (a.options["75"] < b.options["75"]) {
        return -1;
      }

      return 0;
    }
    if (aValue > bValue) {
      return 1;
    }
    if (aValue < bValue) {
      return -1;
    }
    return 0;
  });
}

export const map75To41473Value = (value75) => {
  const mapValue = map_75_41473.find((m) => m["75"] === value75);

  return mapValue ? mapValue["41473"] : value75;
}
