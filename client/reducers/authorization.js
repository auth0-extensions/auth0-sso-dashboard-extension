import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  authorizationEnabled: false,
  authorizationApiAvailable: false
};

export const authorization = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_AUTHORIZATION_STATUS_PENDING]: state =>
    state.merge({
      authorizationEnabled: false,
      authorizationApiAvailable: false
    }),
  [constants.FETCH_AUTHORIZATION_STATUS_REJECTED]: state =>
    state.merge({
      authorizationEnabled: false,
      authorizationApiAvailable: false
    }),
  [constants.FETCH_AUTHORIZATION_STATUS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      authorizationEnabled: data.authorizationEnabled,
      authorizationApiAvailable: data.authorizationApiAvailable
    });
  }
});
