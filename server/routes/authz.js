import { Router } from 'express';

import * as authz from '../lib/authz';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(data => res.json({ authzEnabled: data.authzEnabled }))
      .catch(next);
  });

  api.post('/', requireScope('manage:applications'), (req, res, next) => {
    authz.enable(req, storage)
      .then(() => res.json({ enabled: true }))
      .catch(next);
  });

  api.delete('/', requireScope('manage:applications'), (req, res, next) => {
    authz.disable(req, storage)
      .then(() => res.json({ enabled: false }))
      .catch(next);
  });

  return api;
};
