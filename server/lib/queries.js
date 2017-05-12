import _ from 'lodash';
import Promise from 'bluebird';
import request from 'superagent';
import memoizer from 'lru-memoizer';
import { managementApi, ValidationError } from 'auth0-extension-tools';

import config from './config';
import logger from './logger';


const getAuthorizationApiUrl = () => {
  if (config('AUTHZ_API_DEV_URL')) {
    return config('AUTHZ_API_DEV_URL');
  }

  let publicUrl = config('PUBLIC_WT_URL');

  if (publicUrl[publicUrl.length - 1] === '/') {
    publicUrl[publicUrl.length - 1] = '';
  }

  const authorizationApiUrl = process.env.AUTHZ_API_URL;
  const splittedUrl = publicUrl.split('/');

  splittedUrl[splittedUrl.length - 1] = authorizationApiUrl;

  return splittedUrl.join('/');
};

/*
 * Get authz api access token
 */
const getAuthorizationToken = () =>
  new Promise((resolve, reject) => {
    const body = {
      client_id: config('AUTH0_CLIENT_ID'),
      client_secret: config('AUTH0_CLIENT_SECRET'),
      audience: 'urn:auth0-authz-api',
      grant_type: 'client_credentials'
    };

    request('POST', `https://${config('AUTH0_DOMAIN')}/oauth/token`)
      .send(body)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err || !res.body || !res.body.access_token) {
          logger.error(res.body);
          return reject(err);
        }

        return resolve(res.body.access_token);
      });
  });

const getAuthorizationTokenCached = Promise.promisify(
  memoizer({
      load: (callback) => {
        getAuthorizationToken()
          .then(accessToken => callback(null, accessToken))
          .catch(err => callback(err));
      },
      hash: () => 'auth0-authz-apiToken',
      max: 100,
      maxAge: 60 * 60000
    }
  ));

export const getGroups = () =>
  new Promise((resolve, reject) => {
    getAuthorizationTokenCached()
      .then((token) => {
        if (!token) {
          return resolve(null);
        }

        request('GET', `${getAuthorizationApiUrl()}/groups`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              logger.error(res.body);
              return reject(err);
            }

            return resolve(res.body.groups || []);
          });
      })
      .catch(reject);
  });

export const getGroupsForUser = (userId) =>
  new Promise((resolve, reject) => {
    getAuthorizationTokenCached()
      .then((token) => {
        if (!token) {
          return resolve(null);
        }

        if (!userId) {
          return reject(new ValidationError('User ID is required.'));
        }

        request('GET', `${getAuthorizationApiUrl()}/users/${userId}/groups/calculate`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              logger.error(res.body);
              return reject(err);
            }

            const groupIDs = _.map(res.body || [], (item) => item._id);

            return resolve(groupIDs);
          });
      })
      .catch(reject);
  });


const getToken = (req) => {
  const isAdministrator = req.user && req.user.access_token &&
    req.user.access_token.length;
  if (isAdministrator) {
    return Promise.resolve(req.user.access_token);
  }

  return managementApi.getAccessTokenCached(
    config('AUTH0_DOMAIN'),
    config('AUTH0_CLIENT_ID'),
    config('AUTH0_CLIENT_SECRET'),
  );
};

const makeRequest = (req, path, method, payload) =>
  new Promise((resolve, reject) => getToken(req).then((token) => {
    request(method, `https://${config('AUTH0_DOMAIN')}/api/v2/${path}`)
      .send(payload || {})
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          logger.error(res.body);
          return reject(err);
        }

        return resolve(res.body);
      });
  }),
);

export const getResourceServer = (req, audience) =>
  makeRequest(req, 'resource-servers', 'GET')
    .then((apis) => {
      const api = apis.filter(item => item.identifier === audience);
      return api.length && api[0];
    });

export const createResourceServer = (req) => {
  const payload = {
    name: config('API_NAME') || 'SSO Dashboard API',
    identifier: config('API_AUDIENCE') || 'urn:auth0-sso-dashboard',
    signing_alg: 'RS256',
    scopes: [
      { value: 'read:applications', description: 'Get applications' },
      { value: 'manage:applications', description: 'Manage applications' }
    ],
    token_lifetime: 86400
  };

  return makeRequest(req, 'resource-servers', 'POST', payload);
};

export const deleteResourceServer = req =>
  getResourceServer(req, 'urn:auth0-sso-dashboard')
    .then((api) => {
      if (api.id) {
        return makeRequest(req, `resource-servers/${api.id}`, 'DELETE');
      }

      return Promise.resolve();
    });

const getGrantId = req =>
  makeRequest(req, 'client-grants', 'GET')
    .then(grants => grants.filter(item => (item.client_id === config('AUTH0_CLIENT_ID') && item.audience === 'urn:auth0-authz-api')))
    .then(grants => grants[0] && grants[0].id);


export const addGrant = req =>
  makeRequest(req, 'client-grants', 'POST', {
    client_id: config('AUTH0_CLIENT_ID'),
    audience: 'urn:auth0-authz-api',
    scope: [ 'read:users', 'read:groups' ]
  });

export const removeGrant = req =>
  getGrantId(req)
    .then(id => {
      if (id) {
        return makeRequest(req, `client-grants/${id}`, 'DELETE');
      }

      return Promise.resolve();
    });
