import { Router } from 'express';

import * as authz from '../lib/authz';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.post('/', requireScope('manage:applications'), (req, res, next) => {
    authz.enable(req, storage)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.delete('/', requireScope('manage:applications'), (req, res, next) => {
    authz.disable(req, storage)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
