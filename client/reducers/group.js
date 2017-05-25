import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  groupId: null,
  record: Map()
};

export const group = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_GROUP_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      appId: action.meta.appId
    }),
  [constants.FETCH_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the group: ${action.errorMessage}`
    }),
  [constants.FETCH_GROUP_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    const app = fromJS(data.group);
    return state.merge({
      loading: false,
      record: app
    });
  }
});
