const { Router } = require('express');

const { getGroups } = require('../lib/queries');
const { requireScope } = require('../lib/middlewares');

module.exports = (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
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
