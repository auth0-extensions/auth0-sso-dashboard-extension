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
        promise: axios.get('/api/applications', {
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
        promise: axios.get('/api/applications/all', {
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
        promise: axios.get('/api/applications/clients', {
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
        promise: axios.get('/api/connections', {
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
  return (dispatch) => {
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
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_APPLICATION,
      meta: {
        appId,
        onSuccess: () => {
          onSuccess();
        }
      },
      payload: {
        promise: axios.put(`/api/applications/${appId}`, data, {
          responseType: 'json'
        })
      }
    });
  };
}

export function requestCreateApplication() {
  return {
    type: constants.REQUEST_APPLICATION_CREATE
  };
}

export function cancelCreateApplication() {
  return {
    type: constants.CANCEL_APPLICATION_CREATE
  };
}
/*
* Update the app details.
*/
export function createApplication(data, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_APPLICATION,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(cancelCreateApplication());
          dispatch(fetchApplicationsAll());
        }
      },
      payload: {
        promise: axios.post('/api/applications', data, {
          responseType: 'json'
        })
      }
    });
  };
}

export function requestDeleteApplication(appId) {
  return {
    type: constants.REQUEST_APPLICATION_DELETE,
    meta: {
      appId
    }
  };
}

export function cancelDeleteApplication() {
  return {
    type: constants.CANCEL_APPLICATION_DELETE
  };
}

export function deleteApplication(appId, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.DELETE_APPLICATION,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchApplicationsAll());
        }
      },
      payload: {
        promise: axios.delete(`/api/applications/${appId}`, {
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

/*
* Load all groups with at least one application
*/
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

/*
* Load all groups
*/
export function fetchGroupsAll() {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_GROUPS,
      payload: {
        promise: axios.get('/api/groups/all', {
          responseType: 'json'
        })
      }
    });
  };
}

export function onClientChange(client) {
  return {
    type: constants.APPLICATION_CLIENT_CHANGE,
    meta: {
      client
    }
  };
}

export function onTypeChange(type) {
  return {
    type: constants.APPLICATION_TYPE_CHANGE,
    meta: {
      type
    }
  };
}

export function onNameChange(name) {
  return {
    type: constants.APPLICATION_NAME_CHANGE,
    meta: {
      name
    }
  };
}


