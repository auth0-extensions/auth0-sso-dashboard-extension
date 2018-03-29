const { Router } = require('express');

const config = require('../lib/config');
const { getGroups } = require('../lib/queries');
const { requireScope } = require('../lib/middlewares');

module.exports = (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    if (!config('ALLOW_AUTHZ')) {
      return res.json([]);
    }

    return storage.read()
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
