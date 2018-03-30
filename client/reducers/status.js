import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  isAdmin: false
};

export const status = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_STATUS_PENDING]: state =>
    state.merge({
      isAdmin: false
    }),
  [constants.FETCH_STATUS_REJECTED]: state =>
    state.merge({
      isAdmin: false
    }),
  [constants.FETCH_STATUS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      isAdmin: data.isAdmin
    });
  }
});
