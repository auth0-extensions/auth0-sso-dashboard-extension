const { Router } = require('express');
const { ForbiddenError } = require('auth0-extension-tools');
const { middlewares } = require('auth0-extension-express-tools');

const config = require('../lib/config');
const connections = requie('./connections');
const applications = require('./applications');
const groups = require('./groups');
const authorization = require('./authorization');

module.exports = (storage) => {
  const api = Router();

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
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
