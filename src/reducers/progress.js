import { LOADING_START, LOADING_END } from '../constants';

const initialState = {
  loading: null
};

export default (state = initialState, action) => {
  switch(action.type) {
    case LOADING_START:
      return { ...state, loading: true };
    case LOADING_END:
    	return { ...state, loading: false };
    default:
      return state;
  }
}