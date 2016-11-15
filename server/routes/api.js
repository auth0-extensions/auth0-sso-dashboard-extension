import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import { getUser } from '../lib/middlewares';
import * as constants from '../constants';

import applications from './applications';
import connections from './connections';

export default (storage) => {
  const api = Router();
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      req.user.scope = [ 'access:applications' ];
      next();
    }
  }));
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:sso-dashboard',
    baseUrl: config('WT_URL'),
    onLoginSuccess: (req, res, next) => {
      req.user.scope = [ 'access:applications', 'manage:applications' ];
      next();
    }
  }));

  api.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));

  api.use(getUser);
  api.use('/applications', applications(storage));
  api.use('/connections', connections());
  api.get('/status', (req, res) => {
    console.log(req.user);
    res.json({ isAdmin: req.user.scope && req.user.scope.indexOf('access:applications') > -1 });
  });
  return api;
};
