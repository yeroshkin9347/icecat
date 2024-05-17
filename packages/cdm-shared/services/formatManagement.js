import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

// FormatConfiguration
//
const BASE = `${env.CDM_FORMAT_MANAGEMENT_SERVICE_URI}/api/FormatConfiguration`;

export const getFormatConfigurationById = id => axios.get(`${BASE}/${id}`);
