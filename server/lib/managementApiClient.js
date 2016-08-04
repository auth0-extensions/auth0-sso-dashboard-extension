import ms from 'ms';
import { ManagementClient } from 'auth0';
import Promise from 'bluebird';
import memoizer from 'lru-memoizer';
import request from 'request-promise';

import logger from './logger';

const getAccessToken = Promise.promisify(
  memoizer({
    load: (domain, clientId, clientSecret, callback) => {
      logger.debug(`Requesting access token for ${clientId} - https://${domain}/api/v2/`);

      const options = {
        uri: `https://${domain}/oauth/token`,
        body: {
          audience: `https://${domain}/api/v2/`,
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret
        },
        json: true
      };

      request.post(options)
        .then((data) => {
          callback(null, data.access_token);
        })
        .catch((err) => {
          callback(err);
        });
    },
    hash: (domain, clientId, clientSecret) => `${domain}/${clientId}/${clientSecret}`,
    max: 100,
    maxAge: ms('1h')
  }
));

module.exports.getAccessToken = getAccessToken;

module.exports.getForClient = (domain, clientId, clientSecret) =>
  getAccessToken(domain, clientId, clientSecret)
    .then(accessToken => new ManagementClient({ domain, token: accessToken }));

module.exports.getForAccessToken = (domain, accessToken) =>
  Promise.resolve(new ManagementClient({ domain, token: accessToken }));
