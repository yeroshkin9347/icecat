import axios from "axios";
import { stringify, parse } from "qs";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import fileDownload from "js-file-download";
import includes from "lodash/includes";

export const updateUrl = (parameters, history, pathname) => {
  let search = "";
  let separator = "?";

  search = stringify(pickBy(parameters, identity), {
    strictNullHandling: true,
    encode: false,
  });

  if (!isEmpty(search)) search = `${separator}${search}`;

  const p = pathname ? pathname : window.location.pathname;

  const newUrl = `${window.location.origin}${p}${search}`;

  // prevents pushing same url if function won't change url.
  if (window.location.href !== newUrl) {
    if (history) history.push(`${p}${search}`);
    else window.history.pushState(null, null, newUrl);
  }
};

export const parseQueryStringToObject = (q) =>
  parse(q, { strictNullHandling: true });

export const paramObject = (
  queryString = window.location.search.substring(1)
) => {
  return isEmpty(queryString) ? {} : parseQueryStringToObject(queryString);
};

export const getImageLink = (url, size) => {
  if (!url)
    return null;

  if(!includes(url, "cdmc.cedemo.com") && !includes(url, "storage.gra.cloud.ovh.net/v1/AUTH_8f75d74f077b4b88b4aa7227d4ee5f6f/media"))
    return url;

  let _size = size;
  if (size === "-small" && includes(url, "/images/"))
    _size = "-Small";
  else if (size === "-medium" && includes(url, "/images/"))
    _size = "-Medium";
  else if (size === "-large" && includes(url, "/images/"))
    _size = "-Large";

  let dotIndex = url.lastIndexOf(".");
  if (dotIndex === -1)
    return url + _size;
  else
    return url.substring(0, dotIndex) + _size + url.substring(dotIndex);
};

export const downloadContent = (url) => {
  return axios({
    url: url,
    method: "GET",
    responseType: "blob",
    maxContentLength: 5000000,
    crossdomain: true,
    headers: { sendToken: false },
  });
};

export const browserDownload = (url, filename) =>
  downloadContent(url).then((res) => fileDownload(res.data, filename));
