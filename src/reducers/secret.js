import { SET_TOKEN, DELETE_TOKEN } from '../constants/secret';

const initialState = {
  login: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, login: true };
    case DELETE_TOKEN:
      return { ...state, login: false };
    default:
      return state;
  }
};