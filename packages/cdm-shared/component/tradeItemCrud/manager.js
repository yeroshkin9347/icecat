import get from "lodash/get";

export const LAYOUT_GROUP_CONFIGURATION = {
  MARKETING: {
    showChannels: true,
    showPropertiesEdit: true,
    showTranslations: true
  },
  PRICING: {
    showChannels: true,
    showPropertiesEdit: true
  },
  // 'ChannelManagement': {},
  LOGISTIC: {
    showChannels: true,
    showPropertiesEdit: true
  },
  // 'Assortment': {},
  // 'Variant': {},
  TRANSLATIONS: {},
  // 'Enrichment': {},
  IMAGES: {
    showChannels: true,
    showPropertiesEdit: false
  },
  // 'Videos': {},
  DOCUMENTS: {
    showChannels: true,
    showPropertiesEdit: false
  },
  // 'Parents': {},
  // 'AttributesChannelManagement': {},
  MEDIAINFORMATIONS: {
    showChannels: true,
    showPropertiesEdit: true
  },
  STATUS: {
    showChannels: true,
    showPropertiesEdit: true
  }
};

export const ALLOWED_GROUPS = {
  MARKETING: 0,
  PRICING: 1,
  // 'ChannelManagement': 3,
  LOGISTIC: 4,
  // 'Assortment': 5,
  // 'Variant': 6,
  // 'Translations': 7,
  // 'Enrichment': 8,
  IMAGES: 9,
  // 'Videos': 10,
  DOCUMENTS: 11,
  // 'Parents': 12,
  // 'AttributesChannelManagement': 13,
  MEDIAINFORMATIONS: 14,
  STATUS: 15
};

export const KEYED_PROPERTIES_GROUPS = {
  MARKETING: "marketing",
  PRICING: "catalogPrices",
  LOGISTIC: "logistic",
  TRANSLATIONS: "translations",
  IMAGES: "imageResourceMetadatas",
  DOCUMENTS: "documentResourceMetadatas",
  MEDIAINFORMATIONS: "mediaInformations",
  STATUS: "status"
};

export const DEFAULT_CHANNEL = {
  retailerIds: [],
  targetMarketIds: [],
  startDate: null,
  endDate: null
};

export const GROUP_DEFAULT_OBJECTS = {
  _default: {
    values: {},
    channels: []
  },
  Marketing: {
    values: {},
    channels: [],
    translations: [],
    variantValues: []
  },
  Pricing: {
    values: {},
    channels: []
  },
  Media: {
    values: [],
    channels: []
  },
  Translations: {
    languageCode: null,
    values: {},
    variantValues: []
  },
  Status: {
    values: {},
    channels: [],
    translations: [],
    variantValues: []
  },
};

export const TRANSLATIONS_GROUP_KEY = "TRANSLATIONS";
export const TRANSLATIONS_LANGUAGE_CODE_KEY = "languageCode";

export const isFixedValue = tradeItemProperty =>
  !!get(tradeItemProperty, "valuesGroupId", null);

export const getTradeItemGroupCurrentItem = (currentGroupKey, index) => {
  return `${currentGroupKey}.${index || 0}`;
};

export const getTradeItemPropertyKey = (valuesKey, propertyCode) => {
  return `${valuesKey}.${propertyCode}`;
};

export const getDefaultTargetMarketId = tradeItem =>
  get(
    tradeItem,
    `${KEYED_PROPERTIES_GROUPS["Marketing"]}[0].channels[0].targetMarketIds`
  );

export const getNewObjectForGroup = (group, defaultTargetMarketId) => {
  let newGroupObject = null;

  if (get(GROUP_DEFAULT_OBJECTS, group, null)) {
    newGroupObject = Object.assign({}, get(GROUP_DEFAULT_OBJECTS, group));
  } else {
    switch (group) {
      case "MARKETING":
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS.Marketing);
        break;
      case "PRICING":
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS.Pricing);
        break;
      case "IMAGES":
      case "DOCUMENTS":
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS.Media);
        break;
      case "TRANSLATIONS":
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS.Translations);
        break;
      case "STATUS":
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS.Status);
        break;
      default:
        newGroupObject = Object.assign({}, GROUP_DEFAULT_OBJECTS._default);
    }
  }

  if (defaultTargetMarketId && newGroupObject.channels) {
    newGroupObject.channels = [
      Object.assign({}, DEFAULT_CHANNEL, {
        targetMarketIds: defaultTargetMarketId
      }),
      ...newGroupObject.channels
    ];
  }

  return newGroupObject;
};



export const isFullTextProperty = property => {
  return property.code === "full_product_description"
      || property.code === "short_description"
      || property.code === "long_description"
      || property.code === "product_highlights"
      || property.code === "bullet_points"
      || property.multipleLines;
}


export const isPropertyMultiple = property =>
  get(property, "cardinality") === "Multiple";

export const isPropertyNested = (property) => {
  if (
    property.discriminator === "CompositeProductPropertyViewModel" &&
    Array.isArray(property.properties) &&
    property.properties[0].properties
  ) {
    return true;
  }
  return false;
};
