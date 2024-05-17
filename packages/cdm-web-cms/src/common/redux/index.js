import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { localizeReducer } from "react-localize-redux";
import auth from "cdm-shared/redux/auth";
import tank from "cdm-shared/redux/tank";
import theme from "cdm-shared/redux/theme";
import notification from "cdm-shared/redux/notification";
import message from "cdm-shared/redux/message";
import transformation from "cdm-shared/redux/reducers/transformation";
import subscription from "cdm-shared/redux/reducers/subscription";
import localize from "cdm-shared/redux/localize";

const defaultReducers = {};

const reducersToCombine = {
  auth,
  theme,
  tank,
  notification,
  message,
  transformation,
  // localization
  localize,
  subscription
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
