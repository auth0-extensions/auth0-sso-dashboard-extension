import jwt from 'express-jwt';
import { Router } from 'express';

import { expressJwtSecret } from 'jwks-rsa';
import config from '../lib/config';
import * as middlewares from '../lib/middlewares';

import applications from './applications';
import connections from './connections';
import logs from './logs';
import users from './users';

export default () => {
  const api = Router();
  api.use(middlewares.managementClient);
  api.use(middlewares.parseUser);
  api.use(jwt({
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: config('EXTENSION_CLIENT_ID'),
    issuer: `https://${config('AUTH0_DOMAIN')}/`,
    algorithms: [ 'RS256' ]
  }));
  api.use('/applications', applications());
  api.use('/connections', connections());
  api.use('/users', middlewares.isAdmin, users());
  api.use('/logs', logs());
  return api;
};
