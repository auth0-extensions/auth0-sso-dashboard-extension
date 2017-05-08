import { Router } from 'express';

import { getGroups } from '../lib/queries';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(data => {
        if (data.authzEnabled) {
          return getGroups(req.params.appId)
            .then(groups => res.json(groups));
        }

        return res.json([])
      })
      .catch(next);
  });

  return api;
};
