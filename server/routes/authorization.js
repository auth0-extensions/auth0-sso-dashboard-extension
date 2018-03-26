import { Router } from 'express';

import config from '../lib/config';
import * as authorization from '../lib/authorization';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:authorization'), (req, res, next) => {
    if (!config('ALLOW_AUTHZ')) {
      return res.json({ authorizationApiAvailable: false });
    }

    authorization.getStatus(req, storage)
      .then(status => res.json(status))
      .catch(next);
  });

  api.post('/', requireScope('manage:authorization'), (req, res, next) => {
    if (!config('ALLOW_AUTHZ')) {
      return next();
    }

    authorization.enable(req, storage)
      .then(() => res.json({ enabled: true }))
      .catch(next);
  });

  api.delete('/', requireScope('manage:authorization'), (req, res, next) => {
    if (!config('ALLOW_AUTHZ')) {
      return next();
    }

    authorization.disable(req, storage)
      .then(() => res.json({ enabled: false }))
      .catch(next);
  });

  return api;
};
