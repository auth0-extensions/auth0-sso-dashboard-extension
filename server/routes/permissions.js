import { Router } from 'express';

import { getPermissions } from '../lib/authz';
import { requireScope } from '../lib/middlewares';

export default (config) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    getPermissions(config, req.user.access_token)
      .then(permissions => res.json(permissions))
      .catch(next);
  });

  return api;
};
