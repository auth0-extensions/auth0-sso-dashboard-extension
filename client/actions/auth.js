import url from 'url';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

const webAuthOptions = {
  domain: window.config.AUTH0_CUSTOM_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  responseType: 'id_token token',
  scope: 'openid name email nickname read:applications',
  audience: 'urn:auth0-sso-dashboard'
};

if (window.config.IS_APPLIANCE) {
  webAuthOptions.overrides = {
    __tenant: window.config.AUTH0_DOMAIN.split('.')[0],
    __token_issuer: `https://${window.config.AUTH0_DOMAIN}/`
  };
}

const webAuth = new auth0.WebAuth(webAuthOptions); // eslint-disable-line no-undef

export function login() {
  if (!window.location.hash) {
    webAuth.authorize({ redirect_uri: `${window.config.BASE_URL}/login` });
  }

  return {
    type: constants.LOGIN_PENDING
  };
}

function tokenExpired(expTime) {
  return parseInt(expTime, 10) < (new Date().getTime() + (5 * 60000));
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

function loadForAdmin() {
  const apiToken = sessionStorage.getItem('sso-dashboard:apiToken');

  if (apiToken) {
    const decodedToken = jwtDecode(apiToken);
    if (!decodedToken || isExpired(decodedToken)) {
      return false;
    }

    return {
      token: apiToken,
      user: decodedToken,
      issuer: url.parse(decodedToken.iss).hostname
    };
  }

  return false;
}

function loadForUser() {
  const tokenExpirationDate = sessionStorage.getItem('sso-dashboard:tokenExpirationDate');
  const accessToken = sessionStorage.getItem('sso-dashboard:accessToken');
  const userProfile = sessionStorage.getItem('sso-dashboard:userProfile');

  if (accessToken && !tokenExpired(tokenExpirationDate)) {
    let user;

    try {
      user = JSON.parse(userProfile);
    } catch (e) {
      user = {};
    }

    return {
      token: accessToken,
      user,
      issuer: user.name || user.username || user.nickname || user.email
    };
  }

  return false;
}

export function logout() {
  return (dispatch, getState) => {
    sessionStorage.removeItem('sso-dashboard:apiToken');
    sessionStorage.removeItem('sso-dashboard:tokenExpirationDate');
    sessionStorage.removeItem('sso-dashboard:accessToken');
    sessionStorage.removeItem('sso-dashboard:userProfile');

    const isAdmin = getState().status.get('isAdmin');
    if (isAdmin) {
      window.location.href = `${window.config.AUTH0_MANAGE_URL}/#/extensions`;
    } else {
      webAuth.logout({ returnTo: window.config.BASE_URL, client_id: window.config.AUTH0_CLIENT_ID });
    }
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const credentials = loadForAdmin() || loadForUser();

    if (credentials) {
      axios.defaults.headers.common.Authorization = `Bearer ${credentials.token}`;

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: credentials.token,
          decodedToken: credentials.user,
          user: credentials.user,
          issuer: credentials.issuer
        }
      });
    }

    if (window.location.hash) {
      webAuth.parseHash(window.location.hash, (parseErr, hash) => {
        if (parseErr) {
          return dispatch({
            type: constants.LOGIN_FAILED,
            payload: {
              error: parseErr
            }
          });
        }

        return webAuth.client.userInfo(hash.accessToken, (infoErr, user) => {
          if (infoErr) {
            return dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: infoErr
              }
            });
          }

          sessionStorage.setItem('sso-dashboard:tokenExpirationDate', new Date().setSeconds(hash.expiresIn));
          sessionStorage.setItem('sso-dashboard:accessToken', hash.accessToken);
          sessionStorage.setItem('sso-dashboard:userProfile', JSON.stringify(user));

          axios.defaults.headers.common.Authorization = `Bearer ${hash.accessToken}`;

          return dispatch({
            type: constants.LOGIN_SUCCESS,
            payload: {
              token: hash.accessToken,
              decodedToken: user,
              user,
              issuer: user.email
            }
          });
        });
      });
    }
  };
}
