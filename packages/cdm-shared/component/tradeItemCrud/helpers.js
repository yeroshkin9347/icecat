import { isRetailer } from '../../redux/hoc/withAuth';
import { getTradeItemProperties, getTradeItemPropertiesForCMS, getTradeItemPropertiesForRetailer } from './api';

export const getTradeItemPropertiesApiHelper = (isAdmin, user) => {
  if (isRetailer(user)) {
    return getTradeItemPropertiesForRetailer;
  }

  return isAdmin ? getTradeItemPropertiesForCMS : getTradeItemProperties;
}