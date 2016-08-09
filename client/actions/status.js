import axios from 'axios';

import * as constants from '../constants';

export function fetchStatus() {
    return {
        type: constants.FETCH_STATUS,
        payload: {
            promise: axios.get('/api/status', {
                responseType: 'json'
            })
        }
    };
}