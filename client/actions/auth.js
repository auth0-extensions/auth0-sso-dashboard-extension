import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

const auth0 = new Auth0({ // eslint-disable-line no-undef
  domain: window.config.AUTH0_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  callbackURL: `${window.config.BASE_URL}/login`,
  callbackOnLocationHash: true
});

export function login(returnUrl) {
  auth0.login({
    state: returnUrl,
    scope: 'openid name email nickname groups roles app_metadata authorization'
  });

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
    sessionStorage.removeItem('sso-dashboard:apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('sso-dashboard:apiToken');
    if (token || window.location.hash) {
      let apiToken = token;

      const hash = auth0.parseHash(window.location.hash);
      if (hash && hash.idToken) {
        apiToken = hash.idToken;
      }

      if (apiToken) {
        const decodedToken = jwtDecode(apiToken);
        if (isExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

        dispatch({
          type: constants.LOADED_TOKEN,
          payload: {
            token: apiToken
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: apiToken,
            decodedToken,
            user: decodedToken
          }
        });
      }
    }
  };
}
