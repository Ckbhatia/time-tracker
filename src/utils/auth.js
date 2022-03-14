import { ERROR_TEXT } from "../constants";
import client from "../utils/client";
import tost from "./toast";

export const getIsAuthenticated = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo !== null;
}

export const logOut = async () => {
  await localStorage.removeItem("userInfo");
  await client.clearStore();
  return true;
};


export const handleAuthError = (error) => {
  tost(ERROR_TEXT, error?.message?.replace(/GraphQL error:/g, ""));
}