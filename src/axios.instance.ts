import axios from "axios";
import { errorToast } from "./functions/toast.message.ts";
import { backEndUrl, refresh, refreshed } from "./config.ts";

export const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = backEndUrl;

axiosInstance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.access_token}`;
axiosInstance.defaults.headers.refresh_token = `Bearer ${localStorage.refresh_token}`;

axiosInstance.interceptors.request.use(
  async function (config) {
    if (config.method === "options") return config;
    if (refresh) {
      refreshed();
      if (localStorage.access_token && localStorage.refresh_token)
        axios
          .get(backEndUrl + "/auth/refresh", {
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`,
              refresh_token: `Bearer ${localStorage.refresh_token}`,
            },
          })
          .then((res) => {
            localStorage.access_token = res.data.access_token;
            localStorage.refresh_token = res.data.refresh_token;
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.access_token}`;
            axiosInstance.defaults.headers.refresh_token = `Bearer ${res.data.refresh_token}`;
          });
    } else if (stay) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
let stay = false;

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.data.statusCode === 403) {
      window.location.href = "/";
    } else {
      errorToast(error.response.data.message);
    }
    return Promise.reject(error);
  }
);
