import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null,
  userEmail: null,
  connection: null
};

export const passwordChange = createReducer(fromJS(initialState), {
  [constants.REQUEST_PASSWORD_CHANGE]: (state, action) =>
    state.merge({
      ...initialState,
      userId: action.user.user_id,
      userName: action.user.name || action.user.user_name || action.user.email,
      userEmail: action.user.email,
      connection: action.connection,
      requesting: true
    }),
  [constants.CANCEL_PASSWORD_CHANGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.PASSWORD_CHANGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.PASSWORD_CHANGE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while changing the password: ${action.errorMessage}`
    }),
  [constants.PASSWORD_CHANGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
