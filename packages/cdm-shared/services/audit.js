import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

// CONFLICTS
//
const BASE_CONFLICTS = `${env.CDM_AUDIT_SERVICE_URI}/api/Audit`;
const GET_TRADE_ITEM_PERSISTED = `${BASE_CONFLICTS}/GetTradeItemPersistedByTradeItemId`;

export const getAuditTradeItemPersisted = (tradeItemId, pageNumber, pageSize) =>
  axios.get(
    `${GET_TRADE_ITEM_PERSISTED}/${tradeItemId}/${pageNumber || 0}/${pageSize ||
      10}`
  );
