import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import connections from './connections';
import applications from './applications';
import groups from './groups';

export default (storage) => {
  const api = Router();

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = [ 'read:applications', 'read:application-groups' ];
      next();
    }
  }));

  // Allow dashboard admins to authenticate.
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:sso-dashboard',
    baseUrl: config('PUBLIC_WT_URL'),
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = [
        'read:applications',
        'manage:applications',
        'read:application-groups',
        'manage:application-groups'
      ];
      next();
    }
  }));

  const auth0 = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN')
  });
  api.use('/applications', applications(auth0, storage));
  api.use('/application-groups', groups(auth0, storage));
  api.use('/connections', connections(auth0));
  api.get('/status', (req, res) => {
    res.json({ isAdmin: req.user.scope && req.user.scope.indexOf('manage:applications') > -1 });
  });
  return api;
};
