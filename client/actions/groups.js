import axios from 'axios';

import * as constants from '../constants';

/*
* Load groups for application.
*/
export function fetchGroups() {
  return (dispatch) => {
    dispatch({
      type: constants.dispatch,
      payload: {
        promise: axios.get('/api/groups', {
          responseType: 'json'
        })
      }
    });
  };
}
