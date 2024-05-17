import { CDM_LOCAL_STORAGE_PREFIX } from "../environment";

export const localStorageSetItem = (key, value) => {
  localStorage.setItem(`${CDM_LOCAL_STORAGE_PREFIX}-${key}`, value);
};

export const localStorageGetItem = key => {
  return localStorage.getItem(`${CDM_LOCAL_STORAGE_PREFIX}-${key}`);
};
