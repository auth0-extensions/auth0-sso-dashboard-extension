import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  authzEnabled: false
};

export const authz = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_AUTHZ_STATUS_PENDING]: (state) =>
    state.merge({
      authzEnabled: false
    }),
  [constants.FETCH_AUTHZ_STATUS_REJECTED]: (state) =>
    state.merge({
      authzEnabled: false
    }),
  [constants.FETCH_AUTHZ_STATUS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      authzEnabled: data.authzEnabled
    });
  }
});
