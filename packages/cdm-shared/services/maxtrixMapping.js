import axios from "axios";
import "./index";
import * as env from "cdm-shared/environment";

const MATRIX_MAPPING_BASE_URI = `${env.CDM_MATRIX_MAPPING_URI}/api/MatrixMapping`;
const UPLOAD_FILE = `${MATRIX_MAPPING_BASE_URI}/UploadFile`;
const POST_NON_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/CreateNonStandardMapping`;
const POST_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/CreateStandardMapping`;
const GET_MAPPING_BY_ID = `${MATRIX_MAPPING_BASE_URI}/getMapping`;
const GET_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/GetMatrixAnalysis`;
const STANDARD_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/StandardMatrixAnalysis`;
const SAVE_MATRIX_ANALYSIS = `${MATRIX_MAPPING_BASE_URI}/SaveMatrixAnalysis`;
const PUT_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/UpdateStandardMapping`;
const PUT__NON_STANDARD_MAPPING = `${MATRIX_MAPPING_BASE_URI}/UpdateNonStandardMapping`;
export const getMappingById = (mappingId) =>
  axios.get(`${GET_MAPPING_BY_ID}`, {
    params: {
      mappingId,
    },
  });
export const getStandardMatrixAnalysis = () =>
  axios.get(STANDARD_MATRIX_ANALYSIS);

export const getNonStandardMatrixAnalysis = (matrixAnalysisId) =>
  axios.get(`${GET_MATRIX_ANALYSIS}`, {
    params: {
      matrixAnalysisId,
    },
  });

export const createNonStandardMapping = (mapping) =>
  axios.post(`${POST_NON_STANDARD_MAPPING}`, mapping);

export const createStandardMapping = (mapping) =>
  axios.post(`${POST_STANDARD_MAPPING}`, mapping);

export const uploadFilePriceMaxtrixMapping = (file) => {
  var formData = new FormData();
  formData.append("file", file);
  console.log("MATRIX_MAPPING_BASE_URI", MATRIX_MAPPING_BASE_URI);
  return axios.post(`${UPLOAD_FILE}`, formData);
};

// Save matrix analysis
export const saveNonStandardMatrixAnalysis = (matrix) =>
  axios.post(`${SAVE_MATRIX_ANALYSIS}`, matrix);

// Save standard matrix analysis
export const saveStandardMatrixAnalysis = (matrix) =>
  axios.put(`${STANDARD_MATRIX_ANALYSIS}`, matrix);

// Update non-standard mapping
export const updateNonStandardMapping = (id, mapping) =>
  axios.put(`${PUT__NON_STANDARD_MAPPING}/${id}`, mapping);

// Update non-standard mapping
export const updateStandardMapping = (id, mapping) =>
  axios.put(`${PUT_STANDARD_MAPPING}/${id}`, mapping);

export const importCollectionPricing = (
  collectionCode,
  manufacturerEntityId,
  file
) => {
  var formData = new FormData();
  formData.append("file", file);
  axios.post(
    `${env.CDM_IMPORT_RESOURCE_URI}/api/manufacturer/manufacturerimport/ImportCollectionPricing`,
    formData,
    {
      params: {
        collectionCode,
        manufacturerEntityId,
      },
    }
  );
};
