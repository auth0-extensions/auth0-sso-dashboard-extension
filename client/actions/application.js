import axios from 'axios';

import * as constants from '../constants';

/*
 * Load all applications in an Auth0 account.
 */
export function fetchApplications(search = '', reset = false, page = 0) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_APPLICATIONS,
      payload: {
        promise: axios.get('/api/applications', {
          params: {
            search,
            page
          },
          responseType: 'json'
        })
      },
      meta: {
        page
      }
    });
  };
}
/*
 * Fetch the app details.
 */
export function fetchApplication(appId, onSuccess) {
  return (dispatch) =>
  {
    dispatch({
      type: constants.FETCH_APPLICATION,
      meta: {
        appId,
        onSuccess
      },
      payload: {
        promise: axios.get(`/api/applications/${appId}`, {
          responseType: 'json'
        })
      }
    });
  };
}
/*
 * Update the app details.
 */
export function updateApplication(appId, data, onSuccess) {
  return (dispatch) =>
  {
    dispatch({
      type: constants.UPDATE_APPLICATION,
      meta: {
        appId,
        onSuccess: () => {
        dispatch(fetchApplication(appId));
  }
  },
    payload: {
      promise: axios.patch(`/api/applications/${appId}`, data , {
        responseType: 'json'
      })
    }
  });
  };
}