const DEV = "development";
const PROD = "production";
export const IS_DEV = process.env.REACT_APP_ENV === DEV;
export const IS_PROD = process.env.REACT_APP_ENV === PROD;
