import axios from 'axios';
import * as constants from '../constants';

export function fetchConnections() {
  return {
    type: constants.FETCH_CONNECTIONS,
    payload: {
      promise: axios.get('/api/connections', {
        responseType: 'json'
      })
    }
  };
}
