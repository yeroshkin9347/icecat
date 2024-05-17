import axios from "axios";
import "./index";
import qs from "qs";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
const LOGIN = `${env.CDM_AUTH_URI}/connect/token`;
const GET_USER = `${env.CDM_AUTH_URI}/connect/userinfo`;

// Call Authentication service and get a bearer token
//
export const login = (username, password) => {
  const params = {
    username,
    password,
    client_id: env.CDM_AUTH_CLIENT_ID,
    client_secret: env.CDM_AUTH_CLIENT_SECRET,
    grant_type: env.CDM_AUTH_GRANT_TYPE,
    scope: {$set: "openid profile organization right TradeItemIndexerService TradeItemStorageService ExportStatisticService PricingService TriggerManagementService TradeItemPropertiesManagementService ImportService UserManagementService AuditService ManufacturerManagementService TradeItemStatisticsService PreComputingService LogisticService MatrixValidationService SubscriptionService EnrichmentRequestService EnrichmentService TradeItemNetworkEligibilityService BusinessRuleEvaluationService RetailerManagementService CollectionManagementService MessagingService RetailerGatewayService MappingManagementService ExportConfigurationManagementService"}
  };
  return axios.post(LOGIN, qs.stringify(params));
};

// Get user information
//
export const getUser = () => axios.get(GET_USER);
