import Promise from 'bluebird';
import request from 'request';

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

      console.log('token', body);
      return resolve(body);
    });
  });

export const getPermissions = (config) =>
  new Promise((resolve, reject) => {
    getToken(config)
      .then((token) => {
        if (!token) {
          return resolve(null);
        }

        const options = {
          method: 'GET',
          url: `${config('AUTHORIZE_API_URL')}/permissions`,
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json'
          }
        };

        request(options, function (error, response, body) {
          if (error) {
            return reject(error);
          }

          const fake = [
            { name: 'test' },
            { name: 'another' },
            { name: 'else' }
          ];

          const permissions = (body && body.permissions) || fake;

          console.log('permissions', body);
          return resolve(permissions);
        });
      });
    });
