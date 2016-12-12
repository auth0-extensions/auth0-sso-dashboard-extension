import axios from 'axios';

import * as constants from '../constants';

export function fetchStatus() { // eslint-disable-line import/prefer-default-export
  return {
    type: constants.FETCH_STATUS,
    payload: {
      promise: axios.get('/api/status', {
        responseType: 'json'
      })
    }
  };
}
