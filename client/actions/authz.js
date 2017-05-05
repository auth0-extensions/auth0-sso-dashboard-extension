import axios from 'axios';

import * as constants from '../constants';

export function fetchAuthzStatus() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_AUTHZ_STATUS,
      payload: {
        promise: axios.get('/api/authz', {
          responseType: 'json'
        })
      }
    });
  };
}

export function updateAuthzStatus(enable) {
  return (dispatch) => {
    const method = (enable) ? 'post' : 'delete';
    dispatch({
      type: constants.UPDATE_AUTHZ_STATUS,
      payload: {
        promise: axios[method]('/api/authz', {
          responseType: 'json'
        })
      }
    });
  };
}
