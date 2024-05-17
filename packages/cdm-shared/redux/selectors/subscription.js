export const getOfferData = (state) => state.subscription.offer || {};
export const getOfferDataList = (state) => state.subscription.offerlist || null;
export const offerListLoader = (state) => state.subscription.offerlistloader;
export const manufacturerData= state => state.subscription.manufacturerdata;
export const connectorsData = (state) => state.subscription.connectorsdata;
export const getSubscriptionsData = (state) => state.subscription.subscriptions || {};
export const getConnectionsData = (state) => state.subscription.connections || {};
export const getSubscriptionsFailure = (state) =>
  state.subscription.subscriptionsfailure || null;
export const getConnectionsFailure = (state) =>
  state.subscription.connectionsfailure || null;
export const getConnectionsSuccess = (state) =>
  state.subscription.connectionssuccess || null;
export const getConnectionsLoader = (state) =>
  state.subscription.connectionsloader || false;
export const getTargetMarkets = (state) =>state.subscription.targetmarkets || null;
export const getRetailer = (state) => state.subscription.retailer || null;
export const getConnectors = (state) => state.subscription.connectors || {};
export const getConnectorsFailure = (state) =>
  state.subscription.connectorsfailure || null;
export const getConnectorsSuccess = (state) =>
  state.subscription.connectorssuccess || null;
export const getConnectorsLoader = (state) =>
  state.subscription.connectorsloader || false;

export const getConnectorsMassTools = (state) =>
    state.subscription.connectorsmasstools || {};
export const getConnectorsMassFailure = (state) =>
    state.subscription.connectorsinmassfailure || null;
export const getConnectorsMassSuccess = (state) =>
    state.subscription.connectorsinmasssuccess || null;
export const getConnectorsMassLoader = (state) =>
    state.subscription.connectorsinmassloader || false;

export const getConnectionsMassTools = (state) =>
    state.subscription.connectionsmasstools || {};
export const getConnectionsMassFailure = (state) =>
    state.subscription.connectionsinmassfailure || null;
export const getConnectionsMassSuccess = (state) =>
    state.subscription.connectionsinmasssuccess || null;
export const getConnectionsMassLoader = (state) =>
    state.subscription.connectionsinmassloader || false;

export const getRetailerData = (state) => state.subscription.retailerdata || {};
export const getGroupListData = (state) => state.subscription.grouplist || [];

export const getRetailerFailure = (state) =>
    state.subscription.retailerfailure || null;
export const getRetailerSuccess = (state) =>
    state.subscription.retailersuccess || null;
export const getRetailerLoader = (state) =>
    state.subscription.retailerloader || false;

export const getExportActionData = (state) =>
    state.subscription.exportactiondata || [];
