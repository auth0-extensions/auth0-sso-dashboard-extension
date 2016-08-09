import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
    isAdmin: false
};

export const status = createReducer(fromJS(initialState), {
        [constants.FETCH_STATUS_PENDING]: (state, action) =>
    state.merge({
        isAdmin: false
    }),
    [constants.FETCH_STATUS_REJECTED]: (state, action) =>
    state.merge({
        isAdmin: false
    }),
    [constants.FETCH_STATUS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
        isAdmin: data.isAdmin
    });
}
});