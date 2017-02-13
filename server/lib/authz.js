import Promise from 'bluebird';
import request from 'request';
import memoizer from 'lru-memoizer';

/*
 * Get authz api access token
 */
const getToken = (config) =>
  new Promise((resolve, reject) => {
    if (!config('AUTHZ_API_CLIENT_ID') || !config('AUTHZ_API_CLIENT_SECRET') || !config('AUTHZ_API_AUDIENCE')) {
      return resolve(null);
    }

    const body = {
      client_id: config('AUTHZ_API_CLIENT_ID'),
      client_secret: config('AUTHZ_API_CLIENT_SECRET'),
      audience: config('AUTHZ_API_AUDIENCE'),
      grant_type: 'client_credentials'
    };
    const options = {
      method: 'POST',
      url: `https://${config('AUTH0_DOMAIN')}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    };

    request(options, function (error, response, body) {
      if (error) {
        return reject(error);
      }

      let result = null;

      try {
        const parsed = JSON.parse(body);
        result = parsed.access_token || null;
      } catch (e) {
        return reject(e);
      }

      return resolve(result);
    });
  });

const getTokenCached = Promise.promisify(
  memoizer({
      load: (config, callback) => {
        getToken(config)
          .then(accessToken => callback(null, accessToken))
          .catch(err => callback(err));
      },
      hash: () => 'auth0-authz-apiToken',
      max: 100,
      maxAge: 60 * 60000
    }
  ));


export const getPermissions = (config) =>
  new Promise((resolve, reject) => {
    getTokenCached(config)
      .then((token) => {
        if (!token) {
          return resolve(null);
        }

        const options = {
          method: 'GET',
          url: `${config('AUTHZ_API_URL')}/permissions?field=applicationId&q=${config('EXTENSION_CLIENT_ID')}`,
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json'
          }
        };

        request(options, function (error, response, body) {
          if (error) {
            return reject(error);
          }

          let result = null;

          try {
            const parsed = JSON.parse(body);
            result = parsed.permissions || null;
          } catch (e) {
            return reject(e);
          }

          return resolve(result);
        });
      });
    });
