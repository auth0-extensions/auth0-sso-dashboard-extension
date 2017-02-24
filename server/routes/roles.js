import { Router } from 'express';

import { getRolesForApp } from '../lib/authz';
import { requireScope } from '../lib/middlewares';

export default () => {
  const api = Router();

  api.get('/:appId?', requireScope('manage:applications'), (req, res, next) => {
    getRolesForApp(req.params.appId)
      .then(permissions => res.json(permissions))
      .catch(next);
  });

  return api;
};
