import axios from "axios";
import authHeader from "../functions/authHeader";

const API_URL = "http://localhost:8080/user/";

export const getPublicContent = () => {
  return axios.get(API_URL);
};

export const getUserBoard = () => {
  return axios.get(API_URL + "me", { headers: authHeader() });
};

export const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};
