import { isRetailer, isManufacturer } from "cdm-shared/redux/hoc/withAuth";
import {
  cmsGetManufacturerEntitiesLight,
  getManufacturerEntitiesByManufacturerIdCatalog,
} from "cdm-shared/services/manufacturer";
import { importMatrix, importMatrixCms } from "cdm-shared/services/import";
import { getManufacturerId } from "../../redux/hoc/withUser";

export const getManufacturerEntities = (user) => () => {
  if (isManufacturer(user)) {
    return getManufacturerEntitiesByManufacturerIdCatalog(getManufacturerId(user));
  } else if (isRetailer(user)) {
    return null;
  } else {
    return cmsGetManufacturerEntitiesLight();
  }
};

export const triggerImport = (user) => (entityId, file) => {
  if (isManufacturer(user)) {
    return importMatrix(entityId, file);
  } else if (isRetailer(user)) {
    return null;
  } else {
    return importMatrixCms(entityId, file);
  }
};
