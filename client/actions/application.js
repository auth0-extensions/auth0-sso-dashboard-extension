import axios from 'axios';

import * as constants from '../constants';


/*
 * Load all enabled applications in an Auth0 account.
 */
export function fetchApplications() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_APPLICATIONS,
      payload: {
        promise: axios.get(`/api/applications`, {
          responseType: 'json'
        })
      }
    });
  };
}
/*
 * Load all applications in an Auth0 account.
 */
export function fetchApplicationsAll() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_APPLICATIONS,
      payload: {
        promise: axios.get(`/api/applications/all`, {
          responseType: 'json'
        })
      }
    });
  };
}
/**
 * clients
 * @param enabledOnly
 */
export function fetchClients() {

  return (dispatch) => {
    dispatch({
      type: constants.FETCH_CLIENTS,
      payload: {
        promise: axios.get(`/api/applications/clients`, {
          responseType: 'json'
        })
      }
    });
  };
}
/**
 * connections
 * @param enabledOnly
 */
export function fetchConnections() {

  return (dispatch) => {
    dispatch({
      type: constants.FETCH_CONNECTIONS,
      payload: {
        promise: axios.get(`/api/connections`, {
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
/*
 * Update the app details.
 */
export function createApplication(data, onSuccess) {
  return (dispatch) =>
  {
    dispatch({
      type: constants.CREATE_APPLICATION,
      meta: {
        onSuccess: () => {
        onSuccess();
  }
  },
    payload: {
      promise: axios.post(`/api/applications`, data , {
        responseType: 'json'
      })
    }
  });
  };
}

/*
 * Remove the application.
 */
export function deleteApplication(appId, onSuccess) {
  return (dispatch) =>
  {
    dispatch({
      type: constants.REMOVE_APPLICATION,
      meta: {
        onSuccess: () => {
        dispatch(fetchApplicationsAll());
  }
  },
    payload: {
      promise: axios.delete(`/api/applications/${appId}`,  {
        responseType: 'json'
      })
    }
  });
  };
}

export function cancelApplicationSave() {
  return {
    type: constants.CANCEL_APPLICATION_CHANGE
  };
}