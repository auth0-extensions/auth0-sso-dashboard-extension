import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
    loading: false,
    error: null,
    appId: null,
    record: Map()
};
export const application = createReducer(fromJS(initialState), {
        [constants.FETCH_APPLICATION_PENDING]: (state, action) =>
    state.merge({
        loading: true,
        appId: action.meta.appId
    }),
    [constants.FETCH_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
        loading: false,
        error: `An error occured while loading the user: ${action.errorMessage}`
    }),
    [constants.FETCH_APPLICATION_FULFILLED]: (state, action) => {
        const { data } = action.payload;
    // if (data.application[0].client_id !== state.get('appId')) {
    //     return state;
    // }
     return state.merge({
        loading: false,
        record: fromJS(data.application)
    });
}
});