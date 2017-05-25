import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
    loading: false,
    error: null,
    records: [],
    total: 0
};

export const groupedApps = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
    [constants.FETCH_GROUPED_APPLICATIONS_PENDING]: (state) =>
        state.merge({
            loading: true,
            error: null
        }),
    [constants.FETCH_GROUPED_APPLICATIONS_REJECTED]: (state, action) =>
        state.merge({
            loading: false,
            error: `An error occured while loading the applications: ${action.errorMessage}`
        }),
    [constants.FETCH_GROUPED_APPLICATIONS_FULFILLED]: (state, action) =>
        state.merge({
            loading: false,
            error: null,
            records: fromJS(action.payload.data),
            total: action.payload.data.length
        })
});
