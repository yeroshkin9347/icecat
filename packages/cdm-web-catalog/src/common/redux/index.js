import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import auth from "cdm-shared/redux/auth";
import shoppingCart from "./shoppingCart";
import tradeItemProperties from "./tradeItemProperties";
import tank from "cdm-shared/redux/tank";
import theme from "./theme";
import notification from "cdm-shared/redux/notification";
import message from "cdm-shared/redux/message";
import localize from "cdm-shared/redux/localize";

const defaultReducers = {};

const reducersToCombine = {
  auth,
  shoppingCart,
  tradeItemProperties,
  theme,
  tank,
  notification,
  message,
  // localization
  localize,
};

const reducers = combineReducers(reducersToCombine);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const init = Object.assign({}, defaultReducers, initialState || {});
  const store = createStore(
    reducers,
    init,
    composeEnhancers(applyMiddleware(thunk))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(".", () => {
      store.replaceReducer(reducers);
    });
  }
  return store;
}
