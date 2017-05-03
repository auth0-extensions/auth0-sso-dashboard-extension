import { Router } from 'express';

import { getGroups } from '../lib/authz';
import { requireScope } from '../lib/middlewares';

export default () => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    getGroups(req.params.appId)
      .then(groups => res.json(groups))
      .catch(next);
  });

  return api;
};
