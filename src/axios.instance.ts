import axios from "axios";
import { errorToast } from "./functions/toast.message.ts";
import { backEndUrl } from "./config.ts";

export const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = backEndUrl;

axiosInstance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.access_token}`;
axiosInstance.defaults.headers.refresh_token = `Bearer ${localStorage.refresh_token}`;

axiosInstance.interceptors.response.use(null, async function (error) {
  console.log(error, 11);
  if (error.response.data.statusCode === 403) {
    if (error.config.headers.refresh_token) {
      await axiosInstance
        .get("/auth/check")
        .then((res) => {
          console.log(res.data);
          if (res.data === false) {
            console.log(1);
            window.location.href = "/";
          } else {
            localStorage.access_token = res.data.access_token;
            localStorage.refresh_token = res.data.refresh_token;
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.access_token}`;
            axiosInstance.defaults.headers.refresh_token = `Bearer ${res.data.refresh_token}`;
          }
        })
        .catch((e) => {
          console.log(2);
          window.location.href = "/";
        });
    } else {
      console.log(3);
      window.location.href = "/";
    }
  } else {
    errorToast(error.response.data.message);
  }
  return Promise.reject(error);
});
