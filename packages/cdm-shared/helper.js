import { get, isEmpty } from "lodash";
import { AGENDA_PRODUCT_CATEGORIES } from "./constants/agenda";

export const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      zIndex: 99999999,
    };
  },
};

export const getAgendaCategoryCodesParamForFilter = (productCategories) =>
  isEmpty(productCategories)
    ? AGENDA_PRODUCT_CATEGORIES.map((code) => `${code}*`)
    : productCategories.map((cat) => `${get(cat, "code.code")}*`);
