import { SET_TOKEN, DELETE_TOKEN } from '../constants/secret';
import axios from 'axios';

export function setToken(token) {
  window.localStorage.setItem("token", token);
  axios.defaults.headers.common['token'] = token;
  return {
    type: SET_TOKEN
  }
}

export function deleteToken() {
  window.localStorage.clear();
  delete axios.defaults.headers.common['token'];
  return {
    type: DELETE_TOKEN
  }
}