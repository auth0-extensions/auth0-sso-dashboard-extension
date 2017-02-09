import axios from 'axios';

import * as constants from '../constants';

/*
* Load all enabled applications in an Auth0 account.
*/
export function fetchPermissions() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_PERMISSIONS,
      payload: {
        promise: axios.get('/api/permissions', {
          responseType: 'json'
        })
      }
    });
  };
}
