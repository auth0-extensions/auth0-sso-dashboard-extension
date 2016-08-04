import _ from 'lodash';
import { Router } from 'express';
import { managementClient } from '../lib/middlewares';

export default () => {
  const api = Router();

  /*
   * Get a list of applications.
   */
  api.get('/', managementClient, (req, res, next) => {
    req.auth0.clients.getAll({ fields: 'client_id,name,callbacks,global' })
      .then(clients => _.chain(clients)
        .filter({ global: false })
        .sortBy((client) => client.name.toLowerCase())
        .value()
      )
      .then(clients => _.sortByOrder(clients, [ 'groups.length' ], [ false ]))
      .then(clients => res.json(clients))
      .catch(next);
  });

  return api;
};
