import React, {lazy, Suspense, useEffect} from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import ReactGA from "react-ga";
import "cdm-shared/services";
import withUser from "cdm-shared/redux/hoc/withUser";
import { isManufacturer } from "cdm-shared/redux/hoc/withAuth";
import ProtectedRoutes from "./ProtectedRoutes";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
const Catalog = lazy(() => import("./catalog"));
const Calendars = lazy(() => import("cdm-shared/component/calendars"));
const DigitalAssetsManagement = lazy(() => import("./videos"));
const Login = lazy(() => import("./login"));
const ExportStatistics = lazy(() => import("./exportStatistics"));
const ExportStatisticsForRetailer = lazy(() => import("./exportStatisticsForRetailer"));
const AllImportReports = lazy(() => import("./importReports/AllImportReports"));
const ImportDetail = lazy(() => import("./importReports/ImportDetail"));
const TradeItemDetail = lazy(() => import("./importReports/TradeItemDetail"));
const ImportErrors = lazy(() => import("./importReports/errors/ImportErrors"));
const ExportsList = lazy(() => import("./exportation"));
const TradeItem = lazy(() => import("./tradeItem"));
const UploadMatrix = lazy(() => import("./uploadMatrix"));
const CreateTradeItem = lazy(() => import("./tradeItemCrud/CreateTradeItem"));
const UpdateTradeItem = lazy(() => import("./tradeItemCrud/UpdateTradeItem"));
const Users = lazy(() => import("./users"));
const ManufacturerDashboard = lazy(() =>
  import("./dashboard/ManufacturerDashboard")
);
const ManufacturerEligibilityNetwork = lazy(() =>
  import("tradeItemEligibility/ManufacturerEligibilityNetwork")
);
const TradeItemExportActionEligibilityRouted = lazy(() =>
  import("tradeItemEligibility/TradeItemExportActionEligibilityRouted")
);
const MessagingView = lazy(() => import("messaging/MessagingView"));
const Agenda = lazy(() => import("./agenda"));
const Collections = lazy(() => import("./collections"));
const CollectionDetail = lazy(() => import("./collections/detail"));
const ExportRequests = lazy(() => import("./exportRequests"));
const MaintenancePage = lazy(() => import("./maintenance"));

const Routes = ({ location }) => {
  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <Suspense fallback={<LoaderOverlay />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/maintenance" component={MaintenancePage} />
        <ProtectedRoutes>
          <Route
            exact
            path="/"
            component={withUser((props) => {
              return isManufacturer(props.getCurrentUser()) ? (
                <ManufacturerDashboard />
              ) : (
                <Redirect to="/catalog" />
              );
            })}
          />
          <Route path="/calendars" component={Calendars} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/digital-assets-management" component={DigitalAssetsManagement} />
          <Route
            path="/statistics"
            exact
            component={withUser((props) => {
              return isManufacturer(props.getCurrentUser()) ? <ExportStatistics /> : <ExportStatisticsForRetailer/>;
            })}
          />
          <Route path="/import-reports/all" component={AllImportReports} />
          <Route
            path="/import-reports/import-detail/:id"
            component={ImportDetail}
          />
          <Route
            path="/import-reports/import-trade-item-detail/:importId/:id"
            component={TradeItemDetail}
          />
          <Route
            path="/import-reports/errors/:importId/:step?"
            component={ImportErrors}
          />
          <Route path="/upload-matrix" component={UploadMatrix} />
          <Route path="/export" component={ExportsList} />
          <Route path="/product/:lang/:tradeItemId" component={TradeItem} />
          <Route path="/create-product" component={CreateTradeItem} />
          <Route path="/update-product/:id" component={UpdateTradeItem} />
          <Route path="/users/:id?" component={Users} />
          <Route
            path="/network-status"
            component={ManufacturerEligibilityNetwork}
          />
          <Route
            path="/network-status-item/:id"
            component={TradeItemExportActionEligibilityRouted}
          />
          <Route path="/messaging" component={MessagingView} />
          <Route path="/dashboard" component={Agenda} />
          <Route path="/collections" component={Collections} exact />
          <Route path="/collections/:id" component={CollectionDetail} />
          <Route path="/export-requests" component={ExportRequests} exact />
        </ProtectedRoutes>
      </Switch>
    </Suspense>
  );
};

export default withRouter(Routes);
