import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  requesting: false
};

export const createApplication = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_APPLICATION_CREATE]: state =>
    state.merge({
      requesting: true
    }),
  [constants.CANCEL_APPLICATION_CREATE]: state =>
    state.merge({
      requesting: false
    }),
  [constants.CREATE_APPLICATION_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.CREATE_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while creating the application: ${action.errorMessage}`
    }),
  [constants.CREATE_APPLICATION_FULFILLED]: state =>
    state.merge({
      loading: false,
      error: null,
      requesting: false
    })
});
