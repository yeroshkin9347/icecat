import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const RETAILER_BASE_URL = `${env.CDM_ENRICHMENT_REQUEST_SERVICE_URI}/api/retailer`;

const getPagedEnrichmentRequestsForRetailer = (pageNumber, pageSize, filters) =>
  axios.post(`${RETAILER_BASE_URL}/paged`, filters, {
    params: {
      pageNumber,
      pageSize
    }
  });

const getPagedEnrichmentRequestDetailForRetailer = (
  enrichmentRequestId,
  pageNumber,
  pageSize,
  filters
) =>
  axios.post(`${RETAILER_BASE_URL}/detail/paged`, filters, {
    params: {
      enrichmentRequestId,
      pageNumber,
      pageSize
    }
  });

const createEnrichmentRequest = (gtins, data) =>
  axios.post(`${RETAILER_BASE_URL}/create`, {
    gtins: gtins || [],
    data: data || []
  });

export {
  getPagedEnrichmentRequestDetailForRetailer,
  getPagedEnrichmentRequestsForRetailer,
  createEnrichmentRequest
};
