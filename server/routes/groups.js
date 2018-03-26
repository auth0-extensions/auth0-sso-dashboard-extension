import { Router } from 'express';

import config from '../lib/config';
import { getGroups } from '../lib/queries';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    if (!config('ALLOW_AUTHZ')) {
      return res.json([]);
    }

    storage.read()
      .then(data => {
        if (data.authorizationEnabled) {
          return getGroups(req.params.appId)
            .then(groups => res.json(groups));
        }

        return res.json([]);
      })
      .catch(next);
  });

  return api;
};
