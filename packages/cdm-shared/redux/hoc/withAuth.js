import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import indexOf from "lodash/indexOf";
import intersection from "lodash/intersection";
import { withRouter } from "react-router-dom";
import { getUser } from "../../services/auth";
import { formatStringToBoolean } from "../../utils/format";
import withUser from "./withUser";
import {
  localStorageSetItem,
  localStorageGetItem
} from "../../utils/localStorage";

// *************** RIGHTS *******************
export const AUTH_RIGHT_TRADE_ITEM_CREATE = "catalog.manufacturer.trade-item.create";
export const AUTH_RIGHT_TRADE_ITEM_DELETE = "catalog.manufacturer.trade-item.delete";
export const AUTH_RIGHT_USER_CREATE = "catalog.manufacturer.user.create";
export const AUTH_RIGHT_USER_PWD_RESET = "catalog.manufacturer.user.resetPassword";
export const AUTH_RIGHT_USER_DELETE = "catalog.manufacturer.user.delete";
export const AUTH_RIGHT_VIEW_CATALOG_PRICING = "pricing.read";
export const AUTH_RIGHT_VIEW_CATALOG_LOGISTIC = "logistic.full.read";
// ************** ./RIGHTS ******************

export const isRightAllowed = (user, right) =>
  isArray(right)
    ? !isEmpty(intersection(get(user, "right", []), right))
    : indexOf(get(user, "right", []), right) !== -1;

export const isManufacturer = user => get(user, "organization_type", null) === "manufacturer";

export const isRetailer = user => get(user, "organization_type", null) === "retailer";

export const getRetailerCode = user => get(user, "retailerCode", null);

export const getRetailerId = user => get(user, "externalRetailerId", null);

export const getManufacturerId = user => get(user, "organization_id", null);

export const allowVideos = user => formatStringToBoolean(get(user, "allowVideos")) || isManufacturer(user);

export const allowImportReports = user => isManufacturer(user);

export const allowPdf = user =>
  !isEmpty(getPdfExportAuthorizedActions()) ||
  (formatStringToBoolean(get(user, "canDowndloadPdfTradeItemSheet")));

export const allowVideoExport = user =>
  get(user, "externalRetailerId") === "2475";

export const allowShoppingCart = user => user && get(user, "exportActionId");

export const allowCrud = user => isRightAllowed(user, AUTH_RIGHT_TRADE_ITEM_CREATE);

export const allowUserManagement = user => isRightAllowed(user, AUTH_RIGHT_USER_CREATE);

export const allowSettings = user => allowUserManagement(user);

export const allowMessaging = user => isManufacturer(user) || isRetailer(user);

export const allowViewLogistic = user => !isRetailer(user) || isRightAllowed(user, AUTH_RIGHT_VIEW_CATALOG_LOGISTIC);

export const allowViewPricing = user => { return !isRetailer(user) || isRightAllowed(user, AUTH_RIGHT_VIEW_CATALOG_PRICING); }

export const allowStatistics = user => isManufacturer(user) || isRetailer(user);

export const allowViewEligibility = user => isManufacturer(user);

export const getUserId = user => get(user, "sub", null);

export const getIcecatContentToken = user => get(user, "icecat_content_token", null);

// export const getUserScopesAuthorized = user => {
//   return ["Toys"];
// };

export const getExportAuthorizedActions = user =>
  get(user, "exportActionId")
    ? isArray(user.exportActionId)
      ? user.exportActionId
      : [user.exportActionId]
    : [];

export const getPdfExportAuthorizedActions = user =>
  get(user, "pdfActionId")
    ? isArray(user.pdfActionId)
      ? user.pdfActionId
      : [user.pdfActionId]
    : [];

// export const getExportAuthorizedActions = user => ["87f94a82-ceaf-4294-8301-10aa99259f8a", "f67b4742-84e9-491e-8468-0fac665be54a"]

export const allowExportTradeItems = user => !isEmpty(getExportAuthorizedActions(user));

export const allowFullExportTradeItems = user => allowExportTradeItems(user) && isManufacturer(user);

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    logout: token => {
      dispatch({
        type: "AUTH_RESET",
        token
      });
      window.location.href = `/login`;
    }
  };
};

export const doHardLogout = () => {
  localStorageSetItem("token", null);
  localStorageSetItem("user", null);
  window.location.href = `/login`;
};

export default function withAuth(WrappedComponent) {
  return withRouter(
    withUser(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(
        class extends React.Component {
          constructor(props) {
            super(props);
            this.authGate = this.authGate.bind(this);
          }

          componentDidMount() {
            this.authGate();
            const rawUser = localStorageGetItem("user");
            if (rawUser) {
              const user = JSON.parse(rawUser);
              this.props.setUser(user);
            }
          }

          isAccessRefused() {
            return !this.isAccessGranted();
          }

          isAccessGranted() {
            const token = localStorageGetItem("token");
            return (
              token &&
              token !== "" &&
              token !== "null" &&
              token !== null &&
              token !== "undefined"
            );
          }

          authGate() {
            getUser().catch(
              err =>
                this.isUnauthorizedResponse(get(err, "response")) &&
                this.logout()
            );
          }

          isUnauthorizedResponse(response) {
            return response?.status === 401;
          }

          logout() {
            doHardLogout();
          }

          render() {
            return (
              this.isAccessGranted() && <WrappedComponent {...this.props} />
            );
          }
        }
      )
    )
  );
}

export function withVideosAuth(WrappedComponent) {
  return withAuth(
    class extends React.Component {
      render() {
        const { user } = this.props;
        return allowVideos(user) && <WrappedComponent {...this.props} />;
      }
    }
  );
}

export function withImportReportsAuth(WrappedComponent) {
  return withAuth(
    class extends React.Component {
      render() {
        const { user } = this.props;
        return allowImportReports(user) && <WrappedComponent {...this.props} />;
      }
    }
  );
}

export function withTradeItemManagementAuth(WrappedComponent) {
  return withUser(
    class extends React.Component {
      render() {
        const { user } = this.props;
        return allowCrud(user) && <WrappedComponent {...this.props} />;
      }
    }
  );
}

export function withUserManagementAuth(WrappedComponent) {
  return withUser(
    class extends React.Component {
      render() {
        const { user } = this.props;
        return (
          allowUserManagement(user) && <WrappedComponent {...this.props} />
        );
      }
    }
  );
}

export const getOnboardedManufacturers = () => [
  "Auldey",
  "Bandai",
  "Bioviva",
  "Blackrock-games",
  "Brio",
  "Cartamundi",
  "Chicco",
  "Clementoni",
  "Corolle",
  "D'Arpeje",
  "Ecoiffier",
  "Educa",
  "Epoch d'enfance",
  "Evolution",
  "Falk",
  "Faujas",
  "Giochi-preziosi",
  "GP Toys",
  "Infantino",
  "JBM",
  "Jeujura",
  "John-gmbh",
  "Juratoys",
  "Lego",
  "Maped-heller-joustra",
  "Mattel",
  "MGM",
  "Papo",
  "Playmobil",
  "Ravensburger",
  "Revell",
  "Schleich",
  "Silverlit",
  "Smoby",
  "Spin-master",
  "Splash-toys",
  "Tomy",
  "Topi Games",
  "VTech",
  "Yaldone"
];
