import get from "lodash/get";
import { USER_INFO_TEXT } from "../constants";


export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem(USER_INFO_TEXT));
};

export const saveInfo = (key, payload) => {
  if(typeof key === 'string' && key && payload) {
    return localStorage.setItem(key, JSON.stringify(payload));
  }
}

export const getAuthToken = async () => {
  const userInfo = await JSON.parse(localStorage.getItem('userInfo'));
  return get(userInfo, 'token');
}
