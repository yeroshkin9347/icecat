import React from "react";
import get from "lodash/get";
import Medias from "./Medias";
import { getImageLink } from "cdm-shared/utils/url";

const FILE_TYPES_ACCEPTED = ["image/*"];

const CATEGORY_KEY = "imageCategory";

const INDEX_KEY = "index";

const FILE_NAME_PROPERTY = "filename";

const getThumbUrl = img =>
  getImageLink(get(img, "publicUrl", null), "-small");

const getMediaUrl = img => get(img, "publicUrl", null);

const Images = ({ onSelectImage }) => (
  <Medias
    fileTypesAccepted={FILE_TYPES_ACCEPTED}
    categoryIndexKey={CATEGORY_KEY}
    mediaIndexKey={INDEX_KEY}
    fileNamePropertyCode={FILE_NAME_PROPERTY}
    getThumbUrl={getThumbUrl}
    getMediaUrl={getMediaUrl}
    onSelectMedia={onSelectImage}
  />
);

export default Images;
