import { localStorageGetItem } from "../../utils/localStorage";
import { isManufacturer } from "../../redux/hoc/withAuth";

const getUserFromLocalStorage = () => {
  const user = localStorageGetItem("user");
  if (user) return JSON.parse(user);
  return null;
}
const user = getUserFromLocalStorage();
export const TRADE_ITEM_DEFAULT = {
  catalogPrices: [],
  children: [],
  defaultLanguageCode: "fr-FR",
  documentResourceMetadatas: [],
  enrichment: [],
  globalChannels: [],
  identities: [],
  imageResourceMetadatas: [],
  logistic: [],
  manufacturer: isManufacturer(user) ? {
    manufacturerId: user.organization_id,
    name: user.given_name,
  } : { manufacturerId: null, name: null },
  marketing: [
    {
      channels: [
        {
          endDate: null,
          retailerIds: [],
          startDate: null,
          targetMarketIds: ['c86f160b-7c60-4adb-b146-561fc951f38f']
        }
      ]
    }
  ],
  mediaInformations: [],
  taxonomyId: 'b7021c08-b322-4aef-87a9-a56e1a86a38c',
  tradeItemCategory: {code: null, discriminator: 'TradeItemCategoryViewModel'},
  tradeItemId: null,
  tradeItemUnitDescriptor: {code: 'EA'},
  variants: []
}
