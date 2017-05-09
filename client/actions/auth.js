import url from 'url';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

const webAuth = new auth0.WebAuth({ // eslint-disable-line no-undef
  domain: window.config.AUTH0_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  responseType: 'id_token token',
  scope: 'openid name email nickname groups roles app_metadata authorization read:applications',
  audience: 'urn:auth0-sso-dashboard',
  callbackURL: `${window.config.BASE_URL}/login`
});

export function login(redirectUrl) {
  webAuth.authorize({ redirect_uri: `${window.config.BASE_URL}/${redirectUrl}` });

  return {
    type: constants.SHOW_LOGIN
  };
}

function tokenExpired(expTime) {
  return parseInt(expTime) < (new Date().getTime() + (5 * 60000));
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
  return (dispatch, getState) => {
    sessionStorage.removeItem('sso-dashboard:apiToken');
    sessionStorage.removeItem('sso-dashboard:tokenExpirationDate');
    sessionStorage.removeItem('sso-dashboard:accessToken');
    sessionStorage.removeItem('sso-dashboard:userProfile');

    const isAdmin = getState().status.get('isAdmin');
    if (isAdmin) {
      window.location.href = `${window.config.AUTH0_MANAGE_URL}/#/extensions`;
    } else {
      dispatch({
        type: constants.LOGOUT_SUCCESS
      });
    }
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = sessionStorage.getItem('sso-dashboard:apiToken');
    const tokenExpirationDate = sessionStorage.getItem('sso-dashboard:tokenExpirationDate');
    const accessToken = sessionStorage.getItem('sso-dashboard:accessToken');
    const userProfile = sessionStorage.getItem('sso-dashboard:userProfile');

    if (apiToken) {
      const decodedToken = jwtDecode(apiToken);
      if (isExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: apiToken,
          decodedToken,
          user: decodedToken,
          issuer: url.parse(decodedToken.iss).hostname
        }
      });
    }

    if (accessToken && !tokenExpired(tokenExpirationDate)) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      let user;

      try {
        user = JSON.parse(userProfile);
      } catch (e) {
        user = {};
      }

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: accessToken,
          decodedToken: user,
          user: user,
          issuer: user.email
        }
      });
    }

    if (window.location.hash) {
      webAuth.parseHash(window.location.hash, function(parseErr, hash) {
        if (parseErr) {
          return console.log(parseErr);
        }

        webAuth.client.userInfo(hash.accessToken, function(infoErr, user) {
          if (infoErr) {
            return console.log(infoErr);
          }

          sessionStorage.setItem('sso-dashboard:tokenExpirationDate', new Date().setSeconds(hash.expiresIn));
          sessionStorage.setItem('sso-dashboard:accessToken', hash.accessToken);
          sessionStorage.setItem('sso-dashboard:userProfile', JSON.stringify(user));

          axios.defaults.headers.common.Authorization = `Bearer ${hash.accessToken}`;

          dispatch({
            type: constants.LOGIN_SUCCESS,
            payload: {
              token: hash.accessToken,
              decodedToken: user,
              user,
              issuer: user.email
            }
          });

          window.location.href = window.config.BASE_URL;
        });
      });
    }
  };
}
