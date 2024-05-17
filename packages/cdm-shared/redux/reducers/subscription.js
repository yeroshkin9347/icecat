import * as types from "../actions/type";

const initialState = {
  offer_failure: false,
  offerlistloader: false,
};

const subscription = (state = initialState, action) => {
  switch (action.type) {
    case types.CDM_SUBSCRIPTION_OFFER_DATA:
      return { ...state, offer: action.offer };
    case types.CDM_CREATE_OFFER_SUCCESS:
      return { ...state, offer_sucess: action.results, offer_failure: false };
    case types.CDM_CREATE_OFFER_FAILURE:
      return { ...state, offer_sucess: false, offer_failure: true };
    case types.CDM_SUBSCRIPTION_OFFER_DATA_LIST:
      return { ...state, offerlist: action.offerlist };
    case types.CDM_SUBSCRIPTION_SINGLE_OFFER_DATA:
      return { ...state, offer: action.singleoffer };
    case types.CDM_SUBSCRIPTION_LIST_LOADER:
      return { ...state, offerlistloader: action.offerlistloader };
    case types.CDM_MANUFACTURER_DATA:
      return { ...state, manufacturerdata: action.manufacturerdata || [] };
    case types.CDM_SUBSCRIPTIONS_DATA:
      return { ...state, subscriptions: action.subscriptions };
    case types.CDM_SUBSCRIPTIONS_FAILURE:
      return {
        ...state,
        subscriptionsfailure: action.subscriptionsfailure,
      };
    case types.CDM_CONNECTORS_DATA:
      return {
        ...state,
        connectorsdata: action.connectorsdata,
      };
    case types.CDM_CONNECTIONS_DATA:
      return {
        ...state,
        connections: action.connections,
      };
    case types.CDM_CONNECTIONS_FAILURE:
      return {
        ...state,
        connectionsfailure: action.connectionsfailure,
      };
    case types.CDM_CONNECTIONS_SUCCESS:
      return {
        ...state,
        connectionssuccess: action.connectionssuccess,
      };
    case types.CDM_CONNECTIONS_LOADER:
      return {
        ...state,
        connectionsloader: action.connectionsloader,
      };
    case types.CDM_TARGETMARKETS_DATA:
      return {
        ...state,
        targetmarkets: action.targetmarkets,
      };
    case types.CDM_RETAILER_DATA:
      return {
        ...state,
        retailer: action.retailer,
      };
    case types.CDM_SET_CONNECTORS_DATA:
      return {
        ...state,
        connectors: action.connectors,
      };
    case types.CDM_CONNECTORS_SUCCESS:
      return {
        ...state,
        connectorssuccess: action.connectorssuccess,
      };
    case types.CDM_CONNECTORS_FAILURE:
      return {
        ...state,
        connectorsfailure: action.connectorsfailure,
      };
    case types.CDM_CONNECTORS_LOADER:
      return {
        ...state,
        connectorsloader: action.connectorsloader,
      };
    case types.CDM_SET_CONNECTIONS_MASS_TOOLS_DATA:
      return {
        ...state,
        connectionsmasstools: action.connectionsmasstools,
      };
    case types.CDM_CONNECTIONS_IN_MASS_LOADER:
      return {
        ...state,
        connectionsinmassloader: action.connectionsinmassloader,
      };
    case types.CDM_CONNECTIONS_IN_MASS_SUCCESS:
      return {
        ...state,
        connectionsinmasssuccess: action.connectionsinmasssuccess,
      };
    case types.CDM_CONNECTIONS_IN_MASS_FAILURE:
      return {
        ...state,
        connectionsinmassfailure: action.connectionsinmassfailure,
      };
    case types.CDM_RETAILER_OBJECT_DATA:
      return {
        ...state,
        retailerdata: action.retailerdata,
      };
    case types.APP_RETAILERS_GROUPS_LIST:
      return {
        ...state,
        grouplist: action.results,
      };
    case types.CDM_RETAILER_SUCCESS:
      return {
        ...state,
        retailersuccess: action.retailersuccess,
      };
    case types.CDM_RETAILER_FAILURE:
      return {
        ...state,
        retailerfailure: action.retailerfailure,
      };
    case types.CDM_RETAILER_LOADER:
      return {
        ...state,
        retailerloader: action.retailerloader,
      };
  
    case types.GET_EXPORT_ACTION_DATA:
      return {
        ...state,
        exportactiondata: action.responseData,
      };
  
    case types.CDM_SET_CONNECTORS_MASS_TOOLS_DATA:
      return {
        ...state,
        connectorsmasstools: action.connectorsmasstools,
      };
    case types.CDM_CONNECTORS_IN_MASS_SUCCESS:
      return {
        ...state,
        connectorsinmasssuccess: action.connectorsinmasssuccess,
      };
    case types.CDM_CONNECTORS_IN_MASS_FAILURE:
      return {
        ...state,
        connectorsinmassfailure: action.connectorsinmassfailure,
      };
    case types.CDM_CONNECTORS_IN_MASS_LOADER:
      return {
        ...state,
        connectorsinmassloader: action.connectorsinmassloader,
      };
    case types.APP_MANUFACTURERS_DATA:
      return {
        ...state,
        manufacturersingledata: action.resource,
      };
    case types.TAXONOMIES_DATA:
      return {
        ...state,
        taxonomiesdata: action.resource,
      };
    case types.APP_MANUFACTURERS_PDF_DATA:
      return {
        ...state,
        pdfdata: action.results,
      };
    case types.APP_MANUFACTURERS_ENTITIES_DATA:
      return {
        ...state,
        manufacturerentitiesdata: action.results,
      };
    case types.APP_MANUFACTURERS_MATRIX_MAPPING_DATA:
      return {
        ...state,
        matrixdata: action.results,
      };
    case types.APP_MANUFACTURERS_IMAGE_CATEGORIES_DATA:
      return {
        ...state,
        imagecategories: action.results,
      };
    case types.BUSINESS_RULES_SET_DATA:
      return {
        ...state,
        businessRulesSets: action.results,
      };
    case types.APP_MANUFACTURERS_LANGUAGES_DATA:
      return {
        ...state,
        languages: action.results,
      };
    case types.APP_GET_ALL_RETAILER_DATA:
      return {
        ...state,
        retaileralldata: action.results,
      };
    case types.APP_ENRICHMENT_CONFIGURATIONS_DATA:
      return {
        ...state,
        enrichmentconfigurationsdata: action.results,
      };
    default:
      return state;
  }
};

export default subscription;
