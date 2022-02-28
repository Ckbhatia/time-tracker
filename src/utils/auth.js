export const getIsAuthenticated = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo?.token !== null;
}