import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null
};

export const deleteUser = createReducer(fromJS(initialState), {
  [constants.REQUEST_DELETE_USER]: (state, action) =>
    state.merge({
      ...initialState,
      userId: action.user.user_id,
      userName: action.user.user_name || action.user.email,
      requesting: true
    }),
  [constants.CANCEL_DELETE_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the user: ${action.errorMessage}`
    }),
  [constants.DELETE_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
