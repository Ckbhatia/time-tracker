import client from "../utils/client";

export const getIsAuthenticated = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo !== null;
}

export const logOut = async () => {
  await localStorage.removeItem("userInfo");
  await client.clearStore();
  return true;
};
