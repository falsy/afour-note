import { APIURL } from '../constants/config.constant';

const initialState = {
  status: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APIURL:
      return { ...state, status: true };
    default:
      return state;
  }
};