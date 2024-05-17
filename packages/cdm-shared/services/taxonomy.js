import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//

const GET_TAXONOMIES = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/Taxonomy/GetAll`;
const GET_TAXONOMIESCMS = `${env.CDM_TRADE_ITEM_PROPERTIES_SERVICE_URI}/api/cms/CmsTaxonomy`;

// Get trade item properties by scope
// scopes: LicencedProducts, Toys...
//

export const getTaxonomies = () => axios.get(`${GET_TAXONOMIES}`);
export const getTaxonomiesCMS = () => axios.get(`${GET_TAXONOMIESCMS}`);
