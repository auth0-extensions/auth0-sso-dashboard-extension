import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  requesting: false,
  appId: null
};

export const deleteApplication = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_APPLICATION_DELETE]: (state, action) =>
    state.merge({
      requesting: true,
      appId: action.meta.appId
    }),
  [constants.CANCEL_APPLICATION_DELETE]: state =>
    state.merge({
      requesting: false,
      appId: null
    }),
  [constants.DELETE_APPLICATION_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.DELETE_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the applications: ${action.errorMessage}`
    }),
  [constants.DELETE_APPLICATION_FULFILLED]: state =>
    state.merge({
      loading: false,
      error: null,
      requesting: false,
      appId: null
    })
});
