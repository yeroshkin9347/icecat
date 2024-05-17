import stc from "string-to-color";

const TOYS_CODE = "013";
const DVD_CODE = "019002007";
const VIDEO_GAME_CODE = "019006001";

export const getColorByProductCategoryCode = (code = "") => {
  if (code.startsWith(TOYS_CODE)) {
    return "#ffccbc";
  } else if (code.startsWith(DVD_CODE)) {
    return "#B2DFDB";
  } else if (code.startsWith(VIDEO_GAME_CODE)) {
    return "#E1BEE7";
  }

  return stc(code);
};

export const getProductLinkCatalog = (
  tradeItemId,
  locale,
  masterTradeItemId
) => {
  return masterTradeItemId
    ? `product/${locale}/${tradeItemId}?master=${masterTradeItemId}`
    : `product/${locale}/${tradeItemId}`;
};

export const getProductLinkCms = (tradeItemId, variantId) => {
  return `update-product/${tradeItemId}?hideMenu=true${
    variantId ? `&variantId=${variantId}` : ""
  }`;
};

export const getUpdateProductLinkWithMasterTradeItemId = (tradeItemId, masterTradeItemId, isCms) => {
  if (masterTradeItemId) {
    return `update-product/${masterTradeItemId}?variantId=${tradeItemId}${ isCms ? '&hideMenu=true' : '' }`;
  }

  return `update-product/${tradeItemId}${ isCms ? '?hideMenu=true' : '' }`;
};

export const getPlatformIconResource = (platform) => {
  let icon = null;
  try {
    icon = require(`../../assets/platforms/${platform}.png`);
  } catch (error) {
    icon = require("../../assets/platforms/Platform.png");
  }

  return icon;
};
