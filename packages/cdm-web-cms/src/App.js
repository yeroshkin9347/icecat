import { ApolloProvider } from '@apollo/client';
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { initialize } from "react-localize-redux";
import last from "lodash/last";
import './app.css'
import {
  // theming overrides
  ThemeProvider,
  // style
  Reset,
  GlobalStyle
} from "cdm-ui-components";
import * as sharedEnv from "cdm-shared/environment";
import "cdm-shared/services";
import { getLang } from "cdm-shared/redux/localization";
import ScrollToTop from "cdm-shared/component/ScrollToTop";
import SuspenseFallback from "cdm-shared/component/SuspenseFallback";
import Routes from "./Routes";
import NotificationContainer from "cdm-shared/component/notification/NotificationContainer";
import { initializeApollo } from "cdm-shared/apollo/lib/apollo-client";
import { GET_TRADE_ITEM_TRANSFORMATIONS_GRAPHQL_URL } from "cdm-shared/services/tradeItemTransformation";
import { GET_SUBSCRIPTION_GRAPHQL_URL } from "cdm-shared/services/subscription";

// lazy loaded bundles
// const Catalog = React.lazy(() => import('./catalog'))
const renderLoader = () => <SuspenseFallback />;

// Init functions
//
const initTranslations = store => {
  store.dispatch(
    initialize({
      languages: sharedEnv.CDM_AVAILABLE_LANG,
      translation: null,
      options: {
        renderToStaticMarkup: false,
        defaultLanguage: getLang() || sharedEnv.CDM_DEFAULT_LANG,
        onMissingTranslation: ({ translationId, languageCode }) =>
          last(`${translationId}`.split("."))
      }
    })
  );
};

const ThemeManager = ({ children }) => {
  const currentTheme = useSelector(state => state.theme);
  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
};

const App = ({ store }) => {
  initTranslations(store);
  const client = initializeApollo({
    endpoint: GET_TRADE_ITEM_TRANSFORMATIONS_GRAPHQL_URL,
    endpoint2: GET_SUBSCRIPTION_GRAPHQL_URL,
  });

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <>
            <Reset />
            <ThemeManager>
              <>
                <GlobalStyle />

                <ScrollToTop>
                  <Suspense fallback={renderLoader()}>
                    <Routes />
                  </Suspense>
                </ScrollToTop>

                <NotificationContainer />
              </>
            </ThemeManager>
          </>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
