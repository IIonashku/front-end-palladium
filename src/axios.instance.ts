import axios from "axios";
import { errorToast } from "./functions/toast.message.ts";
import { backEndUrl } from "./config.ts";

export const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = backEndUrl;

axiosInstance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.access_token}`;
axiosInstance.defaults.headers.refresh_token = `Bearer ${localStorage.refresh_token}`;

axiosInstance.interceptors.response.use(null, function (error) {
  console.log(error.response);
  if (error.response.status === 403) {
    console.log(error.response);
    window.location.href = "/";
  } else {
    errorToast(error.response.data.message);
  }
  return Promise.reject(error);
});
