import { isNumber } from "lodash";

export const convertMatrixAnalysisValuesToBackendBase = (
  matrixAnalysisForm
) => {
  const { file } = matrixAnalysisForm;
  const { sheets } = file;

  const sheetsWithValues = sheets.map((sheet) => {
    return {
      ...sheet,
      dataStartingRowNumber: substractOne(sheet.dataStartingRowNumber),
      headerStartingColNumber: substractOne(sheet.headerStartingColNumber),
      headerStartingRowNumber: substractOne(sheet.headerStartingRowNumber),
    };
  });

  return {
    ...matrixAnalysisForm,
    file: {
      ...file,
      sheets: sheetsWithValues,
    },
  };
};

export const convertMatrixAnalysisValuesFromBackendBase = (
  matrixAnalysisForm
) => {
  const { file } = matrixAnalysisForm;
  const { sheets } = file;

  const sheetsWithValues = sheets.map((sheet) => {
    return {
      ...sheet,
      dataStartingRowNumber: addOne(sheet.dataStartingRowNumber),
      headerStartingColNumber: addOne(sheet.headerStartingColNumber),
      headerStartingRowNumber: addOne(sheet.headerStartingRowNumber),
    };
  });

  return {
    ...matrixAnalysisForm,
    file: {
      ...file,
      sheets: sheetsWithValues,
    },
  };
};

const substractOne = (value) => {
  return isNumber(value) ? value - 1 : 0;
};

const addOne = (value) => {
  return isNumber(value) ? value + 1 : 0;
};
