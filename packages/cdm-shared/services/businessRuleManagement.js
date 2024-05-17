import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const MANUFACTURER_BASE_URL = `${env.CDM_BUSINESS_RULE_MGMT_SERVICE_URI}/api/manufacturer`;

export const getBusinessRuleSetByIds = (
  ids,
  languageCode,
  fallbackLanguageCode
) =>
  axios.post(`${MANUFACTURER_BASE_URL}/GetBusinessRuleSetByIds`, ids, {
    params: {
      languageCode,
      fallbackLanguageCode
    }
  });
