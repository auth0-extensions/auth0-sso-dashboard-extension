import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  appId: null,
  record: Map(),
  currentType: null,
  currentClient: null
};
export const application = createReducer(fromJS(initialState), {
  [constants.APPLICATION_CLIENT_CHANGE]: (state, action) =>
    state.merge({
      currentClient: action.meta.client
    }),
  [constants.APPLICATION_TYPE_CHANGE]: (state, action) =>
    state.merge({
      currentType: action.meta.type
    }),
  [constants.FETCH_APPLICATION_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      appId: action.meta.appId
    }),
  [constants.FETCH_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the application: ${action.errorMessage}`
    }),
  [constants.FETCH_APPLICATION_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    const app = fromJS(data.application);
    return state.merge({
      loading: false,
      currentType: app.get('type'),
      currentClient: app.get('client'),
      record: app
    });
  }
});
