import React, { useEffect, useState } from "react";
import get from "lodash/get";
import map from "lodash/map";
import StringTransformer from "./StringTransformer";
import DateTransformer from "./DateTransformer";
import WeightTransformer from "./WeightTransformer";
import SizeTransformer from "./SizeTransformer";
import CurrencyTransformer from "./CurrencyTransformer";
import NumericValueTransformer from "./NumericValueTransformer";
import ListTransformer from "./ListTransformer";

import { getValuesGroupsByIdsAndCategories } from "cdm-shared/services/transformationManagement";

export const getDefaultTransformer = () => {
  return {
    type: "",
    value: null,
    values: [],
  };
};

export const TradeItemTransformationWrapper = ({
  tradeItemProperty,
  tradeItemCategory,
  onChange,
  value,
}) => {
  const [transformerOptions, setTransformerOptions] = useState([]);

  const discriminator = get(tradeItemProperty, "discriminator");
  const numericType = get(tradeItemProperty, "numericType");

  useEffect(() => {
    if (
      (discriminator === "ListProductPropertyLightViewModel" ||
        discriminator === "ListProductPropertyViewModel") &&
      tradeItemProperty &&
      tradeItemProperty.valuesGroupId
    ) {
      getValuesGroupsByIdsAndCategories(
        tradeItemProperty.valuesGroupId,
        "en-GB",
        [tradeItemCategory ? tradeItemCategory.code : ""]
      ).then((res) => {
        if (res.data && res.data.values) {
          const values = res.data.values || {};
          const options = Object.keys(values).map((value) => ({
            value,
            label: values[value],
          }));
          setTransformerOptions(options);
        }
      });
    }
  }, [tradeItemProperty, tradeItemCategory]);

  if (
    discriminator === "NumericProductPropertyViewModel" ||
    discriminator === "NumericProductPropertyLightViewModel"
  ) {
    switch (numericType) {
      case "Weight":
        return <WeightTransformer onChange={onChange} value={value} />;
      case "Size":
        return <SizeTransformer onChange={onChange} value={value} />;
      case "Price":
        return <CurrencyTransformer onChange={onChange} value={value} />;
      case "Value":
        return <NumericValueTransformer onChange={onChange} value={value} />;
      default:
        return `Numeric type not known: ${numericType}`;
    }
  }

  switch (discriminator) {
    case "StringArrayProductPropertyViewModel":
    case "StringArrayProductPropertyLightViewModel":
    case "StringProductPropertyViewModel":
    case "StringProductPropertyLightViewModel":
      return <StringTransformer onChange={onChange} value={value} />;
    case "DateProductPropertyViewModel":
    case "DateProductPropertyLightViewModel":
    case "DateWithAccuracyProductPropertyViewModel":
    case "DateWithAccuracyProductPropertyLightViewModel":
      return <DateTransformer onChange={onChange} value={value} />;
    case "ListProductPropertyViewModel":
    case "ListProductPropertyLightViewModel":
      return (
        <ListTransformer
          onChange={onChange}
          value={value}
          options={transformerOptions}
        />
      );
    default:
      return `Discriminator type not known: ${discriminator}`;
  }
};
