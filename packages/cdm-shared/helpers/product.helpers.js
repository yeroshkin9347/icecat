import { get } from "lodash";
import {
  PRODUCT_EDITION_KEY,
  PRODUCT_PLATFORM_KEY,
} from "../constants/product";

export const getPlatfromFromProductVariant = (variant) => {
  return get(variant, `options.${PRODUCT_PLATFORM_KEY}`);
};

export const getEditionFromProductVariant = (variant) => {
  return get(variant, `options.${PRODUCT_EDITION_KEY}`);
};
