import axios from "axios";
import { CDM_I18N_FILES_URI } from "common/environment";
import { withLocalization as withSharedLocalization } from "cdm-shared/redux/localization";

function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Use this function if we want load i18n files from client
const requireFn = (locale) =>
  require(`${"../../../i18n"}/${locale}`);

// Use this function if we want load i18n files from server
const i18nFilesCached = new Map();
const requireFnAsync = async (locale) => {
  if (!i18nFilesCached.has(locale)) {
    try {
      const response = await axios.get(`${CDM_I18N_FILES_URI}/${locale}.json`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "",
        }
      });
      const data = JSON.parse(b64DecodeUnicode(response.data?.[0]?.Value));
      i18nFilesCached.set(locale, data);
    }
    catch (error) {
      i18nFilesCached.set(locale, requireFn(locale));
    }
  }
  return i18nFilesCached.get(locale);
};

const withLocalization = (WrappedComponent) =>
  withSharedLocalization(WrappedComponent, requireFnAsync);

// const withLocalization = withSharedLocalization;

export { withLocalization };
