import axios from 'axios';
import { APIURL } from '../constants';

function sessionTokenError(history) {
  window.localStorage.clear();
  delete axios.defaults.headers.common['token'];
  history.push('/');
  return;
}

export function getMemoData(history) {
	return axios.post(APIURL+'/getSecretNote').then((res) => {
      if(res.data.error) return sessionTokenError(history);
      return res.data.options === null ? false : res.data;
    }).catch((err) => {
      sessionTokenError(history);
    });
}

export function updateMemoData(history, dataGroups, dataMemos, options) {
	return axios.post(APIURL+'/updateSecretNote', {
	    dataGroups,
	    dataMemos,
	    options
	  }).then((res) => {
	    if(res.data.error) return sessionTokenError(history);
	    return true;
	  }).catch((err) => {
	    sessionTokenError(history);
	  });
}