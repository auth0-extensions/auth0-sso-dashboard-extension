import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null
};

export const deleteGroup = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.DELETE_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.DELETE_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the applications: ${action.errorMessage}`
    }),
  [constants.DELETE_GROUP_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      error: null
    })
});
