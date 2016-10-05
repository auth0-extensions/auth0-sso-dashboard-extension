import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';
import { show, parseHash } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

  return {
    type: constants.SHOW_LOGIN
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    if (window.location.hash) {
      const { id_token } = parseHash(window.location.hash);
      if (id_token) { // eslint-disable-line camelcase
        const decodedToken = jwtDecode(id_token);
        if (isExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${id_token}`; // eslint-disable-line camelcase

        dispatch({
          type: constants.LOADED_TOKEN,
          payload: {
            token: id_token
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: id_token,
            decodedToken,
            user: decodedToken
          }
        });
      }
    }
  };
}
