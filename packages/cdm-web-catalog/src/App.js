import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";
import { Provider, useSelector } from "react-redux";
import { initialize } from "react-localize-redux";
import last from "lodash/last";
import {
  // theming overrides
  ThemeProvider,
  // style
  Reset,
  GlobalStyle,
} from "cdm-ui-components";
import * as sharedEnv from "cdm-shared/environment";
import * as env from "common/environment";
import "cdm-shared/services";
import { getLang } from "cdm-shared/redux/localization";
import ScrollToTop from "cdm-shared/component/ScrollToTop";
import SuspenseFallback from "cdm-shared/component/SuspenseFallback";
import NotificationContainer from "cdm-shared/component/notification/NotificationContainer";
import Routes from "./Routes";
import { allowUseAnalytics } from "common/utils/analytics";

import { LicenseInfo } from "@mui/x-license-pro";

LicenseInfo.setLicenseKey(
  "086ddc883cbac41d5c2e9f318403f76aTz03NDU1NixFPTE3MjYyMjg4MTUwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y"
);

// lazy loaded bundles
// const Catalog = React.lazy(() => import('./catalog'))
const renderLoader = () => <SuspenseFallback />;

// Init functions
//
const initTranslations = (store) => {
  store.dispatch(
    initialize({
      languages: sharedEnv.CDM_AVAILABLE_LANG,
      translation: null,
      options: {
        renderToStaticMarkup: false,
        defaultLanguage: getLang() || sharedEnv.CDM_DEFAULT_LANG,
        onMissingTranslation: ({ translationId, languageCode }) =>
          last(`${translationId}`.split(".")),
      },
    })
  );
};

const initAnalytics = () => {
  // console.log('analytics test mode', env.CDM_ANALYTICS_TEST_MODE)
  ReactGA.initialize(env.CDM_ANALYTICS_TRACKING_ID, {
    testMode: env.CDM_ANALYTICS_TEST_MODE,
  });
};

const ThemeManager = ({ children }) => {
  const currentTheme = useSelector((state) => state.theme);
  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
};

const App = ({ store }) => {
  initTranslations(store);
  allowUseAnalytics() && initAnalytics();
  return (
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
  );
};

export default App;
