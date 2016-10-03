import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import { getUser } from '../lib/middlewares';
import * as constants from '../constants';

import applications from './applications';
import connections from './connections';

export default (storage) => {
  const api = Router();

  api.use(middlewares.authenticateUser(config('AUTH0_DOMAIN'), config('EXTENSION_CLIENT_ID')));

  api.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));

  api.use(getUser);
  api.use('/applications', applications(storage));
  api.use('/connections', connections());
  api.get('/status', (req, res) => {
    res.json({ isAdmin: req.user.role === constants.ADMIN_ACCESS_LEVEL });
  });
  return api;
};
