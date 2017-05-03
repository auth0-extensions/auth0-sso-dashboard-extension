import Promise from 'bluebird';
import request from 'superagent';
import { managementApi } from 'auth0-extension-tools';
import config from './config';

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
          return reject(err);
        }

        return resolve(res.body);
      });
  }),
);
export const getResourceServer = req =>
  makeRequest(req, 'resource-servers', 'GET')
    .then((apis) => {
      const api = apis.filter(item => item.identifier === (config('API_AUDIENCE') || 'urn:sso-dashboard-api'));
      return api.length && api[0];
    });

export const createResourceServer = (req) => {
  const payload = {
    name: config('API_NAME') || 'SSO Dashboard API',
    identifier: config('API_AUDIENCE') || 'urn:sso-dashboard-api',
    signing_alg: 'RS256',
    scopes: [
      { value: 'read:applications', description: 'Get applications data' }
    ],
    token_lifetime: 86400
  };

  return makeRequest(req, 'resource-servers', 'POST', payload);
};

export const deleteResourceServer = req =>
  getResourceServer(req)
    .then((api) => {
      if (api.id) {
        return makeRequest(req, `resource-servers/${api.id}`, 'DELETE');
      }

      return Promise.resolve();
    });
