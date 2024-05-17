import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const BASE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/cms`;
const BASE_CATALOG_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer`;

export const GET_SUBSCRIPTION_GRAPHQL_URL = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/graphql`;

const OFFERS_URI = `${BASE_URI}/offer`;
const MANUFACTURER_ENTITIES_BASE_URI = `${env.CDM_MANUFACTURER_MANAGEMENT_URI}/api/cms/ManufacturerEntity`;
const OFFERS_SERVICE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/offer`;
const CONNECTORS_SERVICE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/connector`;
const CONNECTORS_ALL_SERVICE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/connector/all`;
const CONNECTIONS_SERVICE_URI = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/connection`;
const CONNECTIONS_GET_LINKED_RETAILERS = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/manufacturer/connection/GetLinkedRetailers`;
const SUBSCRIPTIONS_URI = `${BASE_URI}/subscription`;
const CONNECTIONS_URI = `${BASE_URI}/connection`;
const CONNECTORS_URI = `${BASE_URI}/connector`;
const MILESTONES_URI = `${BASE_CATALOG_URI}/milestone/paged`;
const CREATE_MASS_CONNECTORS_URI = `${CONNECTORS_URI}/mass`;
const ACTIONS_BASE_URI = `${env.CDM_TRIGGER_MANAGEMENT_SERVICE}/api/Action`;

const BASE_IMPORT_RESOURCE = `${env.CDM_IMPORT_RESOURCE_URI}/api/ImportResource`;
const GET_IMAGE_CATEGORIES = `${BASE_IMPORT_RESOURCE}/GetImageCategories`;

const MATRIX_MAPPING_BASE_URI = `${env.CDM_MATRIX_MAPPING_URI}/api/MatrixMapping`;
const GET_MAPPINGS = `${MATRIX_MAPPING_BASE_URI}/getMappingsLight`;
const GET_MAPPINGS_BY_MANUFATURER = `${MATRIX_MAPPING_BASE_URI}/getMappingsByManufacturer`;
const POLL = `${BASE_IMPORT_RESOURCE}/PollByManufacturerEntityId`;

// Languages
//
const LANGUAGE_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/language`

export const getOffers = languageCode =>
    axios.get(`${OFFERS_SERVICE_URI}/${languageCode}`);

export const getOffersList = () => axios.get(`${OFFERS_URI}`);
export const getOffer= (id) => axios.get(`${OFFERS_URI}/${id}`);

export const getConnectors = languageCode =>
    axios.get(`${CONNECTORS_SERVICE_URI}`, { params: { languageCode } });

export const getAllConnectors = () =>
    axios.get(`${CONNECTORS_ALL_SERVICE_URI}`);

export const getConnections = languageCode =>
    axios.get(`${CONNECTIONS_SERVICE_URI}`, { params: { languageCode } });

export const getLinkedRetailers = () =>
    axios.get(CONNECTIONS_GET_LINKED_RETAILERS);

// RETAILER API

const BASE_RETAILER_API = `${env.CDM_SUBSCRIPTION_SERVICE_URI}/api/catalog/retailer`;

export const getLinkedManufacturers = () =>
    axios.get(`${BASE_RETAILER_API}/connection/GetLinkedManufacturers`);

export const createConnectorsInMass = (values) =>
    axios.post(`${CREATE_MASS_CONNECTORS_URI}`, values);

export const getConnectionsByConnectorIds = (connectorIds) =>
    axios.get(`${CONNECTIONS_URI}/getConnectionsByConnectorIds`, {
        params: {
            connectorIds,
        },
    });

// Get export precomputed actions
//
export const getExportActions = () => axios.get(`${ACTIONS_BASE_URI}/GetExportTradeItemsWithImagesActions`)

// Get export precomputed actions with Images
//
export const getPreComputedExportActions = () => axios.get(`${ACTIONS_BASE_URI}/GetExportPreComputedTradeItemActions`)

// Get all manufacturers entities
export const getMatrixMappings = () => axios.get(`${GET_MAPPINGS}`)
export const getMatrixMappingsByManufacturer = (manufacturerId) => axios.get(`${GET_MAPPINGS_BY_MANUFATURER}`, { params: { manufacturerId } })

// get image categories
//
export const getImageCategories = () => axios.get(`${GET_IMAGE_CATEGORIES}`);

export const getLanguages = (value) => axios.get(`${LANGUAGE_BASE_URI}`);

//OFFER SERVICE
export const createOffer = (offer) => axios.post(`${OFFERS_URI}`, offer);
export const updateOffer = (offer) => axios.put(`${OFFERS_URI}`, offer);
export const deleteOffer = (offerId) =>axios.delete(`${OFFERS_URI}`, { params: { offerId } });

//SUBSCRIPTION SERVICE
export const getSubscription = (id) => axios.get(`${SUBSCRIPTIONS_URI}/${id}`);
export const createSubscription = (subscription) =>axios.post(`${SUBSCRIPTIONS_URI}`, subscription);
export const updateSubscription = (subscription) =>axios.put(`${SUBSCRIPTIONS_URI}`, subscription);
export const deleteSubscription = (subscriptionId) =>axios.delete(`${SUBSCRIPTIONS_URI}`, { params: { subscriptionId } });

//CONNECTOR SERVICE
export const createConnector = (connector) =>axios.post(`${CONNECTORS_URI}`, connector);
export const updateConnector = (connector) =>axios.put(`${CONNECTORS_URI}`, connector);
export const deleteConnector = (connectorId) =>axios.delete(`${CONNECTORS_URI}`, { params: { connectorId } });
export const getConnector = (id) => axios.get(`${CONNECTORS_URI}/${id}`);
export const getSubscriptionByManufacturerId = (manufacturerId) =>axios.get(`${SUBSCRIPTIONS_URI}/manufacturer_id/${manufacturerId}`);

//CONNECTION SERVICE
export const createConnection = (connections) =>axios.post(`${CONNECTIONS_URI}`, connections);
export const updateConnection = (connections) =>axios.put(`${CONNECTIONS_URI}`, connections);
export const getConnection = (id) => axios.get(`${CONNECTIONS_URI}/${id}`);
export const deleteConnection = (connectionsId) =>axios.delete(`${CONNECTIONS_URI}`, { params: { connectionsId } });

//MANUFACTURER SERVICES
export const saveManufacturerEntityById = (id, manufacturerEntity) => axios.put(`${MANUFACTURER_ENTITIES_BASE_URI}/${id}`, manufacturerEntity);
export const createManufacturerEntity = (manufacturerEntity) => axios.post(`${MANUFACTURER_ENTITIES_BASE_URI}`, manufacturerEntity);

//MILESTONES SERVICES

export const getMilestones = (pageNumber, pageSize) => axios.get(`${MILESTONES_URI}/${pageNumber}/${pageSize}`);

// trigger polling
export const pollByManufacturerEntityId = (
    manufacturerEntityId,
    startPollingTimestamp,
    endPollingTimestamp
) =>
    axios.put(
        `${POLL}`,
        {},
        {
            params: {
                manufacturerEntityId,
                startPollingTimestamp,
                endPollingTimestamp
            }
        }
    );
