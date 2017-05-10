import axios from 'axios';

import * as constants from '../constants';

export function fetchAuthorizationStatus() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_AUTHORIZATION_STATUS,
      payload: {
        promise: axios.get('/api/authorization', {
          responseType: 'json'
        })
      }
    });
  };
}

export function updateAuthorizationStatus(enable) {
  return (dispatch) => {
    const method = (enable) ? 'post' : 'delete';
    dispatch({
      type: constants.UPDATE_AUTHORIZATION_STATUS,
      payload: {
        promise: axios[method]('/api/authorization', {
          responseType: 'json'
        })
      }
    });
  };
}
