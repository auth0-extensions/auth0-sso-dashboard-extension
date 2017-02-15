import axios from 'axios';

import * as constants from '../constants';

/*
* Load roles for application.
*/
export function fetchRoles(appId) {
  return (dispatch) => {
    const url = (appId) ? `/api/roles/${appId}` : '/api/roles';
    dispatch({
      type: constants.FETCH_ROLES,
      payload: {
        promise: axios.get(url, {
          responseType: 'json'
        })
      }
    });
  };
}
