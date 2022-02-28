import get from "lodash/get";

export const getUserId = () => {
  // return localStorage.getItem('userId');
  // Get and return original id of user
  return 3;
}

export const getAuthToken = async () => {
  const userInfo = await JSON.parse(localStorage.getItem('userInfo'));
  return get(userInfo, 'token');
}