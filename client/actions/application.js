import axios from 'axios';

import * as constants from '../constants';

/*
 * Load all applications in an Auth0 account.
 */
export function fetchApplications(enabledOnly) {
  const all = (enabledOnly) ? '' : '/all';

  return (dispatch) => {
    dispatch({
      type: constants.FETCH_APPLICATIONS,
      payload: {
        promise: axios.get(`/api/applications${all}`, {
          responseType: 'json'
        })
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
        onSuccess(function() {
          dispatch(fetchApplication(appId));
        });
  }
  },
    payload: {
      promise: axios.put(`/api/applications/${appId}`, data , {
        responseType: 'json'
      })
    }
  });
  };
}