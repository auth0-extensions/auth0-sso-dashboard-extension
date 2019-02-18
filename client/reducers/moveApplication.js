import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  appId: null
};

export const moveApplication = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.MOVE_APPLICATION_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.MOVE_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while moving the applications: ${action.errorMessage}`
    }),
  [constants.MOVE_APPLICATION_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      error: null,
      appId: null
    })
});
