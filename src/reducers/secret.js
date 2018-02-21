import { SECRET, GET_SECRET, RESET_SECRET } from '../constants/secret';

const initialState = {
  password: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SECRET:
      return { ...state, password: action.password };
    case GET_SECRET:
      return { ...state, password: state.password };
    case RESET_SECRET:
      return { ...state, password: '' };
    default:
      return state;
  }
};