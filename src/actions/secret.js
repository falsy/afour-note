import { SECRET, GET_SECRET, RESET_SECRET} from '../constants/secret';

export function secret(password) {
  return {
    type: SECRET,
    password: password
  };
}

export function getSecret() {
  return {
    type: GET_SECRET
  }
}

export function resetSecret() {
  return {
    type: RESET_SECRET
  }
}