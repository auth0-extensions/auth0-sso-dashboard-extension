import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  status: null
};

export const updateAuthz = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.UPDATE_AUTHZ_STATUS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null,
      status: null
    }),
  [constants.UPDATE_AUTHZ_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while updating authz integration status: ${action.errorMessage}`,
      status: null
    }),
  [constants.UPDATE_AUTHZ_STATUS_FULFILLED]: (state, action) => {
    return state.merge({
      loading: false,
      error: null,
      status: action.payload && action.payload.data && action.payload.data.enabled
    });
  }
});
