import { AuthenticationClient } from 'auth0';
import Promise from 'bluebird';

module.exports.getForClient = (domain, clientId) =>
  Promise.resolve(new AuthenticationClient({ domain, clientId }));
