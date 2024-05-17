import axios from "axios";
import qs from "qs";
import { doHardLogout } from "../redux/hoc/withAuth";
import { localStorageGetItem } from "../utils/localStorage";
// import { doHardLogout } from '../redux/hoc/withAuth';

axios.interceptors.request.use(function(config) {
  const token = localStorageGetItem("token");
  if (token) {
    if (config.headers.sendToken !== false)
      config.headers.common["Authorization"] = "Bearer " + token;
    // config.headers.common['Content-Type'] = 'application/json'
    if (!config.paramsSerializer)
      config.paramsSerializer = params =>
        qs.stringify(params, { arrayFormat: "indices" });
  }
  return config;
});

// Every 401 must empty token
axios.interceptors.response.use(
  response => response,
  error => {
    if (error && error.response && error.response.status === 401)
      doHardLogout();
    return Promise.reject(error);
  }
);
