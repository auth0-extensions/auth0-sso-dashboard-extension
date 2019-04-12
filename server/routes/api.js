import { Router } from 'express';
import { ForbiddenError } from 'auth0-extension-tools';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import connections from './connections';
import applications from './applications';
import groups from './groups';
import authorization from './authorization';

export default (storage) => {
  const api = Router();

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('IS_APPLIANCE') ? config('AUTH0_DOMAIN') : config('AUTH0_CUSTOM_DOMAIN'),
    audience: config('API_AUDIENCE') || 'urn:auth0-sso-dashboard',
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      if (req.user.scope && req.user.scope.indexOf('manage:applications') > -1 && !req.user.sub.endsWith('@client')) {
        return next(new ForbiddenError('"manage:applications" scope is not allowed for endusers.'));
      }

      return next();
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
      currentRequest.user.scope = [ 'read:applications', 'manage:applications', 'manage:authorization' ];
      next();
    }
  }));

  const auth0 = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN')
  });
  api.use('/applications', applications(auth0, storage));
  api.use('/groups', groups(storage));
  api.use('/authorization', authorization(storage));
  api.use('/connections', connections(auth0));
  api.get('/status', (req, res) => {
    res.json({ isAdmin: (req.user.scope && req.user.scope.indexOf('manage:applications') > -1) });
  });
  return api;
};
