import axios from "axios";
import * as env from "cdm-shared/environment";

// Set the services URIs
//
// Target market
//
const TARGET_MARKET_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/targetmarket`;

export const getTargetMarkets = () => axios.get(`${TARGET_MARKET_BASE_URI}`);

// Languages
//
const LANGUAGES_BASE_URI = `${env.CDM_TARGET_MARKET_URI}/api/language`;

export const getLanguages = () => axios.get(`${LANGUAGES_BASE_URI}`);
