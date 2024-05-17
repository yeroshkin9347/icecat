import React, { lazy, useEffect } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import "cdm-shared/services";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "./AdminLayout";
const Login = lazy(() => import("./login"));
const MessagingView = lazy(() => import("./messaging/MessagingView"));
const Products = lazy(() => import("./products/Products"));
const Videos = lazy(() => import("./videos/Videos"));
const UpdateVideo = lazy(() => import("./videos/UpdateVideo/UpdateVideo"));
const UsersMessages = lazy(() => import("./messaging/UsersMessages"));
const UserMessageDetail = lazy(() => import("./messaging/UserMessageDetail"));
const CreateTradeItem = lazy(() => import("./tradeItemCrud/CreateTradeItem"));
const UpdateTradeItem = lazy(() => import("./tradeItemCrud/UpdateTradeItem"));
const Imports = lazy(() => import("./imports/Imports"));
const Transformations = lazy(() => import("./transformations/Transformations"));
const Transformation = lazy(() => import("./transformations/Transformation"));

const Offers = lazy(() => import("./subscription/offers/OfferList"));
const AddOffers = lazy(() => import("./subscription/offers/AddOffers"));

const Subscriptions = lazy(() =>import("./subscription/subscriptions/SubscriptionsList"));
const AddSubscriptions = lazy(() =>import("./subscription/subscriptions/AddSubscriptions"));

const Connectors = lazy(() =>
    import("./subscription/connectors/ConnectorsList")
);
const AddConnectors = lazy(() =>
    import("./subscription/connectors/AddConnectors")
);

const Connections = lazy(() =>
    import("./subscription/connections/ConnectionsList")
);
const AddConnections = lazy(() =>
    import("./subscription/connections/AddConnections")
);

const Connectorsmasstool = lazy(() =>
    import("./subscription/massconnectors/AddMassConnectors")
);
const Connectionsmasstool = lazy(() =>import("./subscription/massconnections/AddMassConnections"));

const AddRetailer = lazy(() => import("./retailers/AddRetailer"));
const AddManufacturer = lazy(() => import("./manufacturer/AddManufacturer"));

const Agenda = lazy(() => import("./agenda/Agenda"));


const Routes = ({ location }) => {
  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <AdminLayout>
        <ProtectedRoutes>
          <Route exact path="/">
            <Redirect to="/messaging" />
          </Route>
          <Route path="/messaging" component={MessagingView} />
          <Route path="/users-messages" component={UsersMessages} />
          <Route path="/user-message/:id" exact component={UserMessageDetail} />
          <Route path="/products" exact component={Products} />
          <Route path="/videos" exact component={Videos} />
          <Route path="/update-video/:id" exact component={UpdateVideo} />
          <Route path="/create-product" exact component={CreateTradeItem} />
          <Route path="/update-product/:id" exact component={UpdateTradeItem} />
          <Route path="/imports" exact component={Imports} />
          <Route path="/transformations" exact component={Transformations} />
          <Route path="/transformation/:id?" exact component={Transformation} />

          <Route path="/offers" exact component={Offers} />
          <Route path="/create-offers" exact component={AddOffers} />
          <Route path="/update-offers/:id" exact component={AddOffers} />
          <Route path="/connectors" exact component={Connectors} />
          <Route path="/create-connectors" exact component={AddConnectors} />
          <Route path="/connections" exact component={Connections} />
          <Route path="/create-connections" exact component={AddConnections} />
          <Route path="/update-connections/:id" exact component={AddConnections} />
          <Route
            path="/update-connectors/:id"
            exact
            component={AddConnectors}
          />
          <Route
            path="/create-subscriptions"
            exact
            component={AddSubscriptions}
          />
          <Route
            path="/update-subscriptions"
            exact
            component={AddSubscriptions}
          />
          <Route
            path="/update-subscriptions/:id"
            exact
            component={AddSubscriptions}
          />

          <Route path="/subscriptions" exact component={Subscriptions} />
          <Route
            path="/connectors-mass-tool"
            exact
            component={Connectorsmasstool}
          />
          <Route
            path="/connections-mass-tool"
            exact
            component={Connectionsmasstool}
          />
          <Route path="/create-retailer" exact component={AddRetailer} />
          <Route path="/update-retailer/:id" exact component={AddRetailer} />
          <Route path="/create-manufacturer" exact component={AddManufacturer} />
          <Route
              path="/update-manufacturer/:id"
              exact
              component={AddManufacturer}
          />
          <Route path="/agenda" exact component={Agenda} />

        </ProtectedRoutes>
      </AdminLayout>
    </Switch>
  );
};

export default withRouter(Routes);
