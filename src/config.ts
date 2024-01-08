export const backEndUrl =
  process.env.REACT_APP_ENVIROMENT === "dev"
    ? process.env.REACT_APP_BACKEND_URL_LOCAL
    : process.env.REACT_APP_BACKEND_URL_PROD;

export enum availableCarrier {
  TMobile = "T-Mobile",
  MetroByTMoblie = "Metro by T-Mobile",
  verizon = "Verizon Wireless",
  ATT = "AT&T",
}
