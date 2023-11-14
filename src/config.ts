export const backEndUrl =
  process.env.REACT_APP_ENVIROMENT === "dev"
    ? process.env.REACT_APP_BACKEND_URL_LOCAL
    : process.env.REACT_APP_BACKEND_URL_PROD;
