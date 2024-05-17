import * as types from "./type";
import get from "lodash/get";
import {
  getOffer,
  getOffersList,
  getSubscription,
  updateSubscription,
  createSubscription,
  createConnector,
  updateConnector,
  getConnection,
  getConnector,
  createConnectorsInMass,
  getExportActions,
  getPreComputedExportActions,
  getMatrixMappings,
  getImageCategories,
  getLanguages,
  getSubscriptionByManufacturerId,
} from "cdm-shared/services/subscription";
import { getTargetMarkets } from "cdm-shared/services/targetMarket";
import {
  getAllRetailers,
  updateRetailer,
  createRetailer,
  getEnrichmentConfigurationsByRetailerId,
  getGroups,
  getRetailerById,
  updateGroup,
  deleteRetailerById,
} from "cdm-shared/services/retailer";
import {
  getManufacturerById,
  getManufacturerEntitiesByManufacturerId,
} from "cdm-shared/services/manufacturer";
import { getBusinessRulesSets } from "cdm-shared/services/businessRules";
import {
  getManufacturersCms,
  getAllConnectors,
} from "cdm-shared/services/manufacturer";
import sortBy from "lodash/sortBy";
import reduce from "lodash/reduce";
import { getTaxonomies } from "cdm-shared/services/taxonomy";

// get taxonomies
export const setOffersAction = (offer) => (dispatch) => {
  return dispatch({
    type: types.CDM_SUBSCRIPTION_OFFER_DATA,
    offer,
  });
};

//get offers list
export const getOffersListAction = () => (dispatch) => {
  dispatch(offerListLoaderAction(true))
  getOffersList()
    .then((res) => {
      if(res.data){
          return dispatch({
            type: types.CDM_SUBSCRIPTION_OFFER_DATA_LIST,
            offerlist:res.data,
          });
      }
    })
    .catch((e) => {})
    .finally(()=>{
      setTimeout(()=>{
        dispatch(offerListLoaderAction(false))
      },2000)
    })
};

//get offers list
export const getOfferAction = (id) => (dispatch) => {
  getOffer(id)
    .then((res) => {
      if(res.data){
          return dispatch({
            type: types.CDM_SUBSCRIPTION_SINGLE_OFFER_DATA,
            singleoffer:res.data,
          });
      }
    })
    .catch((e) => {
    });
};
//offer list loader
export const offerListLoaderAction = (flag) => (dispatch) => {
  return dispatch({
    type: types.CDM_SUBSCRIPTION_LIST_LOADER,
    offerlistloader:flag
  });
};

//get subscription
export const getManufacturersAction = () => (dispatch) => {
  getManufacturersCms().then((res) => {
    const manufacturerdata = sortBy(get(res, "data"), ["name"]);
    return dispatch({
      type: types.CDM_MANUFACTURER_DATA,
      manufacturerdata
    });
  });
};


export const getAllConnectorsAction = () => (dispatch) => {
  getAllConnectors().then((res) => {
    const connectorsdata = sortBy(
      reduce(
        get(res, "data"),
        (results, connector) => {
          return [
            ...results,
            {
              id: get(connector, "id"),
              name: get(connector, "name"),
              type: get(connector, "type"),
            },
          ];
        },
        []
      ),
      "name"
    );
    return dispatch({
      type: types.CDM_CONNECTORS_DATA,
      connectorsdata,
    });
  });
};
export const setSubscriptionsActions = (subscriptions) => (dispatch) => {
  return dispatch({
    type: types.CDM_SUBSCRIPTIONS_DATA,
    subscriptions,
  });
};

export const setConnectionsActions = (connections) => (dispatch) => {
  return dispatch({
    type: types.CDM_CONNECTIONS_DATA,
    connections,
  });
};

export const getSubscriptionsActions = (id) => (dispatch) => {
  getSubscription(id).then((res) => {
    const subscriptions = get(res, "data");
    return dispatch({
      type: types.CDM_SUBSCRIPTIONS_DATA,
      subscriptions,
    });
  });
};
export const getConnectionsActions = (id) => (dispatch) => {
  getConnection(id).then((res) => {
    const connections = get(res, "data");

    return dispatch({
      type: types.CDM_CONNECTIONS_DATA,
      connections,
    });
  });
};

export const saveSubscriptionsActions = (subscriptions) => (dispatch) => {
  if (subscriptions.id) {
   updateSubscription(subscriptions)
    .then((res) => {})
    .catch((err) => {
      dispatch(subscriptionFailureActions(err));
    });
 } else {
    createSubscription(subscriptions)
    .then((res) => {
    })
    .catch((err) => dispatch(subscriptionFailureActions(err)));
 }
};

export const subscriptionFailureActions = (err) =>(dispatch)=>{
  dispatch({
    type: types.CDM_SUBSCRIPTIONS_FAILURE,
    subscriptionsfailure: err,
  });
}
export const connectionsFailureActions = (err) =>(dispatch)=>{
  dispatch({
    type: types.CDM_CONNECTIONS_FAILURE,
    connectionsfailure: err,
  });
}
export const connectionsSuccessActions = (suc) => (dispatch) => {
  dispatch({
    type: types.CDM_CONNECTIONS_SUCCESS,
    connectionssuccess: suc,
  });
};
export const connectionsLoaderActions = (flag) => (dispatch) => {
  dispatch({
    type: types.CDM_CONNECTIONS_LOADER,
    connectionsloader: flag,
  });
};


export const getTargetMarketAction = () => (dispatch) => {
  getTargetMarkets().then((res) => {
    const targetmarkets = get(res, "data");
    return dispatch({
      type: types.CDM_TARGETMARKETS_DATA,
      targetmarkets,
    });
  });
};

export const getRetailersAction = () => (dispatch) => {
  getAllRetailers().then((res) => {
    const retailer = get(res, "data");
    return dispatch({
      type: types.CDM_RETAILER_DATA,
      retailer,
    });
  });
};

export const setConnectorsActions = (connectors) => (dispatch) => {
  return dispatch({
    type: types.CDM_SET_CONNECTORS_DATA,
    connectors,
  });
};

// connectors actions
export const saveConnectorsActions = (connectors) => (dispatch) => {
  dispatch(connectorsLoaderActions(true));
  if (connectors.id) {
    updateConnector(connectors)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            connectorsSuccessActions({ message: "updated!!", id: res.data })
          );
        } else {
          dispatch(connectorsFailureActions({ message: "Server Error" }));
        }
      })
      .catch((err) => {
        dispatch(connectorsFailureActions(err));
      })
      .finally(() => {
        dispatch(connectorsLoaderActions(false));
      });
  } else {
    createConnector(connectors)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            connectorsSuccessActions({ message: "created!!", id: res.data })
          );
        } else {
          dispatch(connectorsFailureActions({ message: "Server Error" }));
        }
      })
      .catch((err) => dispatch(connectorsFailureActions(err)))
      .finally(() => {
        dispatch(connectorsLoaderActions(false));
      });
  }
};

export const connectorsLoaderActions = (flag) => (dispatch) => {
  return dispatch({
    type: types.CDM_CONNECTORS_LOADER,
    connectorsloader: flag,
  });
};

export const getConnectorsActions = (id) => (dispatch) => {
  getConnector(id).then((res) => {
    const connectors = get(res, "data");
    return dispatch({
      type: types.CDM_SET_CONNECTORS_DATA,
      connectors,
    });
  });
};
export const connectorsFailureActions = (err) => (dispatch) => {
  return dispatch({
    type: types.CDM_CONNECTORS_FAILURE,
    connectorsfailure: err,
  });
};
export const connectorsSuccessActions = (suc) => (dispatch) => {
  return dispatch({
    type: types.CDM_CONNECTORS_SUCCESS,
    connectorssuccess: suc,
  });
};

//connectors mass tools actions
export const setConnectorsMassToolsActions = (connectorsmasstools) => (dispatch) => {
    return dispatch({
        type: types.CDM_SET_CONNECTORS_MASS_TOOLS_DATA,
        connectorsmasstools,
    });
};
export const saveConnectorsMassToolsActions = (connectorsmasstools) => (dispatch) => {
    dispatch(connectorsInMassLoaderActions(true));
    if (!connectorsmasstools.offerIds) connectorsmasstools.offerIds=[];
    createConnectorsInMass(connectorsmasstools)
        .then((res) => {
            if (res.status === 200) {
                dispatch(
                    connectorsInMassSuccessActions({
                        message: `you have created ${res.data.length} connectors`,
                        count: res.data.length,
                    })
                );
            } else {
                dispatch(connectorsInMassFailureActions({ message: "Server Error" }));
            }
        })
        .catch((err) => dispatch(connectorsInMassFailureActions(err)))
        .finally(() => {
            dispatch(connectorsInMassLoaderActions(false));
        });
};


export const connectorsInMassLoaderActions = (flag) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTORS_IN_MASS_LOADER,
        connectorsinmassloader: flag,
    });
};


export const connectorsInMassFailureActions = (err) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTORS_IN_MASS_FAILURE,
        connectorsinmassfailure: err,
    });
};
export const connectorsInMassSuccessActions = (suc) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTORS_IN_MASS_SUCCESS,
        connectorsinmasssuccess: suc,
    });
};

export const setConnectionsMassToolsActions =
    (connectionsmasstools) => (dispatch) => {
        return dispatch({
            type: types.CDM_SET_CONNECTIONS_MASS_TOOLS_DATA,
            connectionsmasstools,
        });
    };

export const saveConnectionsMassToolsActions =
    (connectionsmasstools) => (dispatch) => {
        dispatch(connectionsInMassLoaderActions(true));
        createConnectorsInMass(connectionsmasstools)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(
                        connectionsInMassSuccessActions({
                            message: `you have created ${res.data.length} connectors`,
                            count: res.data.length,
                        })
                    );
                } else {
                    dispatch(
                        connectionsInMassFailureActions({ message: "Server Error" })
                    );
                }
            })
            .catch((err) => dispatch(connectionsInMassFailureActions(err)))
            .finally(() => {
                dispatch(connectionsInMassLoaderActions(false));
            });
    };

export const connectionsInMassLoaderActions = (flag) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTIONS_IN_MASS_LOADER,
        connectionsinmassloader: flag,
    });
};

export const connectionsInMassFailureActions = (err) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTIONS_IN_MASS_FAILURE,
        connectionsinmassfailure: err,
    });
};
export const connectionsInMassSuccessActions = (suc) => (dispatch) => {
    return dispatch({
        type: types.CDM_CONNECTIONS_IN_MASS_SUCCESS,
        connectionsinmasssuccess: suc,
    });
};

export const setRetailerDataActions = (data) => (dispatch) => {
    return dispatch({
        type: types.CDM_RETAILER_OBJECT_DATA,
        retailerdata: data,
    });
};


// Get groups
//
export const getGroupsAction = () => async dispatch => {
    getGroups().then((res) => {
        const responseData = sortBy(get(res, "data.results"), ["name"]);
        return dispatch({
            type: types.APP_RETAILERS_GROUPS_LIST,
            results: responseData,
        });
    });
}

export const getRetailerActions = (id) => async (dispatch) => {
    getRetailerById(id).then((res) => {
        const responseData = get(res, "data")
        dispatch(setRetailerDataActions(responseData));
    });
};

export const saveGroup = (data) => async (dispatch, getState) => {
    if (data.id) {
        return updateGroup(data);
    } else {
        return createGroup(data);
    }
};


//retailer actions
export const saveRetailerDataActions = (retailerdata) => (dispatch) => {
    dispatch(retailerLoaderActions(true));
    if (retailerdata.id) {
        updateRetailer(retailerdata)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(
                        retailerSuccessActions({ message: "updated!!", id: res.data })
                    );
                } else {
                    dispatch(retailerFailureActions({ message: "Server Error" }));
                }
            })
            .catch((err) => {
                dispatch(retailerFailureActions(err));
            })
            .finally(() => {
                dispatch(retailerLoaderActions(false));
            });
    } else {
        createRetailer(retailerdata)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(
                        retailerSuccessActions({ message: "created!!", id: res.data })
                    );
                } else {
                    dispatch(retailerFailureActions({ message: "Server Error" }));
                }
            })
            .catch((err) => dispatch(retailerFailureActions(err)))
            .finally(() => {
                dispatch(retailerLoaderActions(false));
            });
    }
};

export const retailerLoaderActions = (flg) => (dispatch) => {
    return dispatch({
        type: types.CDM_RETAILER_LOADER,
        retailerloader: flg,
    });
};

export const retailerSuccessActions = (data) => (dispatch) => {
    return dispatch({
        type: types.CDM_RETAILER_SUCCESS,
        retailersuccess: data,
    });
};

export const retailerFailureActions = (data) => (dispatch) => {
    return dispatch({
        type: types.CDM_RETAILER_FAILURE,
        retailerfailure: data,
    });
};

export const getExportAcAction = () => (dispatch) => {
    getExportActions()
        .then((res) => {
            if (res.status === 200) {
                const responseData=get(res,"data")
                return dispatch({
                    type: types.GET_EXPORT_ACTION_DATA,
                    responseData
                });
            }
        })
        .catch((e)=> {})
}


// Delete retailer
//
export const deleteRetailer = id => () => deleteRetailerById(id);


// Get manufacturer by its guid
//
export const getManufacturerByIdAction = (manufacturerId) => (dispatch) =>
    getManufacturerById(manufacturerId).then((res) => {
        const resource = get(res,"data");
        dispatch(setManufacturerAction(resource));
    });

export const getSubscriptionByManufacturerIdAction =
    (manufacturerId) => (dispatch) =>
        getSubscriptionByManufacturerId(manufacturerId).then((res) => {
            const resource = get(res, "data");
            dispatch(setSubscriptionsActions(resource));
        });

export const setManufacturerAction = (data) => (dispatch) => {
    return dispatch({
        type: types.APP_MANUFACTURERS_DATA,
        resource: data,
    });
};

export const getBusinessRulesSetsAction = () => (dispatch) =>
    getBusinessRulesSets().then((res) => {
        const results = get(res, "data");
        dispatch({
            type: types.BUSINESS_RULES_SET_DATA,
            results,
        });
    });
export const getTaxonomiesAction = () => (dispatch) =>
    getTaxonomies().then((res) => {
        const resource = get(res, "data");
        dispatch({
            type: types.TAXONOMIES_DATA,
            resource,
        });
    });

// Get PDF actions
//
export const getPdfExportActions = () => dispatch =>{
    getPreComputedExportActions().then((res) =>{
        const results=get(res,"data")
        dispatch({ type: types.APP_MANUFACTURERS_PDF_DATA, results })
    });
}
// Get PDF actions
//
export const getManufacturerEntitiesActions = (manufacturerId) => (dispatch) => {
    getManufacturerEntitiesByManufacturerId(manufacturerId).then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_MANUFACTURERS_ENTITIES_DATA, results });
    });
};

export const setManufacturerEntitiesActions = (data) => (dispatch) => dispatch({ type: types.APP_MANUFACTURERS_ENTITIES_DATA, data });

export const getMatrixMappingsAction = () => (dispatch) => {
    getMatrixMappings().then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_MANUFACTURERS_MATRIX_MAPPING_DATA, results });
    });
};
export const getImageCategoriesAction = () => (dispatch) => {
    getImageCategories().then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_MANUFACTURERS_IMAGE_CATEGORIES_DATA, results });
    });
};
// retrieve languages
export const getLanguagesAction = () => (dispatch) => {
    getLanguages().then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_MANUFACTURERS_LANGUAGES_DATA, results });
    });
};


//get all retailer
export const getAllRetailersAction = () => (dispatch) => {
    getAllRetailers().then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_GET_ALL_RETAILER_DATA, results });
    });
};

//get enrichment configurations by retailer id
export const getEnrichmentConfigurationsByRetailerIdAction = (id) => (dispatch) => {
    getEnrichmentConfigurationsByRetailerId(id).then((res) => {
        const results = get(res, "data");
        dispatch({ type: types.APP_ENRICHMENT_CONFIGURATIONS_DATA, results });
    });
};

