import axios from "axios";
import * as env from "cdm-shared/environment";

const BASE_URL = `${env.CDM_PRE_COMPUTING_SERVICE_URI}`;
const JOB_URL = `${BASE_URL}/api/PreComputingJob`;

// Get last job information for export action
//
export const getPreComputingLastJobByAction = exportActionId =>
  axios.get(`${JOB_URL}/GetLastJobByExportAction/${exportActionId}`);

// Get trade items precomputing status
//
export const getTradeItemsPrecomputingStatus = tradeItemIds =>
  axios.get(`${BASE_URL}/api/TradeItemPreComputingResult/GetTradeItemStatus`, {
    params: {
      tradeItemIds
    }
  });

// Get trade item precomputing status
//
export const getTradeItemPrecomputingStatus = tradeItemId =>
  axios.get(`${BASE_URL}/api/TradeItemPreComputingResult/GetTradeItemStatus`, {
    params: {
      tradeItemIds: [tradeItemId]
    }
  });
