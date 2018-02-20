import { SECRET, GETSECRET } from '../constants/secret';

export function secret(password) {
  return {
    type: SECRET,
    password: password
  };
}

export function getSecret() {
	return {
		type: GETSECRET
	}
}