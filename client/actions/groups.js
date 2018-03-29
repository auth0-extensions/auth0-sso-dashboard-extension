import axios from 'axios';

import * as constants from '../constants';

/*
* Load groups for application.
*/
// eslint-disable-next-line import/prefer-default-export
export function fetchGroups() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_GROUPS,
      payload: {
        promise: axios.get('/api/groups', {
          responseType: 'json'
        })
      }
    });
  };
}
