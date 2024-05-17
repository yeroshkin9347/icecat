export const descriptorType = {
  PALLET      : "PL",
  CASE        : "CS",
  SUBCASE     : "PK",
  EACH        : "EA",
  DISPLAY     : "DS",
}

export const getDescriptorName = (d, translate) => {
  switch(d){
    case descriptorType.PALLET:
      return translate('tradeitem.logistic.descriptorTypePallet');
    case descriptorType.CASE:
      return translate('tradeitem.logistic.descriptorTypeCase');
    case descriptorType.SUBCASE:
      return translate('tradeitem.logistic.descriptorTypeSubcase');
    case descriptorType.EACH:
      return translate('tradeitem.logistic.descriptorTypeEach');
    case descriptorType.DISPLAY:
      return translate('tradeitem.logistic.descriptorTypeDisplay');
    default:
      return "N/A"
  }
};

export const getDescriptorIcon = (d) => {
  switch(d){
    case descriptorType.PALLET:
      return "/images/icons/logistic/PL.png";
    case descriptorType.CASE:
      return "/images/icons/logistic/CS.png";
    case descriptorType.SUBCASE:
      return "/images/icons/logistic/CA.png";
    case descriptorType.EACH:
      return "/images/icons/logistic/EA.png";
    case descriptorType.DISPLAY:
      return "/images/icons/logistic/DS.png";
    default:
      return "N/A"
  }
};
