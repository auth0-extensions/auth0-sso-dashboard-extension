import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0
};

export const groups = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_GROUPS_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the groups: ${action.errorMessage}`
    }),
  [constants.FETCH_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
