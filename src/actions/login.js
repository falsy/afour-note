import axios from 'axios';
import { APIURL } from '../constants';

export function login(id, pw, history) {
  axios.post(APIURL+'/login', { id, pw })
  .then((res) => {
    if(!res.data.error) {
      const token = res.data.token;
      window.localStorage.setItem("token", token);
      axios.defaults.headers.common['token'] = token;
      history.push('/'+id);
    }
  });
}

export function logout() {

}