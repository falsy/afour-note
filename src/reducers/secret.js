import { SECRET, GETSECRET } from '../constants/secret';

const initialState = {
  password: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SECRET:
      return { ...state, password: action.password };
    case GETSECRET:
    	return { ...state, password: state.password };
    default:
      return state;
  }
};