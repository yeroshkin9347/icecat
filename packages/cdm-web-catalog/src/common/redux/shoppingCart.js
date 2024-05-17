import findIndex from "lodash/findIndex";
import {
  localStorageGetItem,
  localStorageSetItem
} from "cdm-shared/utils/localStorage";

const getLocalStorageKey = () => `shopping-cart`;

const addToLocalStorageMiddleware = value => {
  localStorageSetItem(getLocalStorageKey(), JSON.stringify(value));
  return value;
};

const getInitialState = () => {
  return JSON.parse(localStorageGetItem(getLocalStorageKey())) || [];
};

const shoppingCart = (state = getInitialState(), action) => {
  switch (action.type) {
    case "MOD_SHOPPING_CART_RESET":
      return addToLocalStorageMiddleware([]);
    case "MOD_SHOPPING_CART_ADD":
      return addToLocalStorageMiddleware([...state, action.item]);
    case "MOD_SHOPPING_CART_REMOVE":
      return addToLocalStorageMiddleware([
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ]);
    case "MOD_SHOPPING_CART_FIND_REMOVE":
      const index = findIndex(state, item => action.fn(item));
      return addToLocalStorageMiddleware([
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]);
    default:
      return state;
  }
};

export default shoppingCart;
