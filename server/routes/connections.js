import _ from 'lodash';
import { Router } from 'express';
import { requireScope } from '../lib/middlewares';

export default (auth0) => {
  const api = Router();
  api.get('/', auth0, requireScope('manage:applications'), (req, res, next) => {
    req.auth0.connections.getAll({ fields: 'name' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => res.json(connections))
      .catch(next);
  });
  return api;
};
