import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  requesting: false
};

// eslint-disable-next-line import/prefer-default-export
export const updateApplication = createReducer(fromJS(initialState), {
  [constants.UPDATE_APPLICATION_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.UPDATE_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while updating application: ${action.errorMessage}`
    }),
  [constants.UPDATE_APPLICATION_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      error: null,
      requesting: false
    })
});
