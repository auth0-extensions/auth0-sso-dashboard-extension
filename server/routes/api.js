import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import connections from './connections';
import applications from './applications';

export default (storage) => {
  const api = Router();

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      req.user.scope = [ 'read:applications' ];
      next();
    }
  }));

  // Allow dashboard admins to authenticate.
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:sso-dashboard',
    baseUrl: config('WT_URL'),
    onLoginSuccess: (req, res, next) => {
      req.user.scope = [ 'read:applications', 'manage:applications' ];
      next();
    }
  }));

  api.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN')
  }));
  api.use('/applications', applications(storage));
  api.use('/connections', connections());
  api.get('/status', (req, res) => {
    res.json({ isAdmin: req.user.scope && req.user.scope.indexOf('manage:applications') > -1 });
  });
  return api;
};
