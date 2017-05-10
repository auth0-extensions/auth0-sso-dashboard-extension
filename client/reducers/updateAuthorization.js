import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  status: null
};

export const updateAuthorization = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.UPDATE_AUTHORIZATION_STATUS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null,
      status: null
    }),
  [constants.UPDATE_AUTHORIZATION_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while updating authorization status: ${action.errorMessage}`,
      status: null
    }),
  [constants.UPDATE_AUTHORIZATION_STATUS_FULFILLED]: (state, action) => {
    return state.merge({
      loading: false,
      error: null,
      status: action.payload && action.payload.data && action.payload.data.enabled
    });
  }
});
