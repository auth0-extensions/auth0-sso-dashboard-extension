import _ from 'lodash';
import { Router } from 'express';
import { managementClient, isAdmin } from '../lib/middlewares';

export default () => {
  const api = Router();

  /*
   * Get a list of all applications.
   */
  api.get('/all', isAdmin, (req, res, next) => {
    req.auth0.clients.getAll()
      .then(clients => _.filter(clients, (client) => !client.global))
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Get a list of enabled applications.
   */
  api.get('/', (req, res, next) => {
    req.auth0.clients.getAll()
      .then(clients => _.filter(clients, (client) => (client.client_metadata && client.client_metadata['sso-dashboard-enabled'])))
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Get application.
   */
  api.get('/:id', (req, res, next) => {
    req.auth0.clients.getAll({ client_id: req.params.id })
      .then(clients => _.chain(clients)
        .filter({ client_metadata: false })
        .sortBy((client) => client.name.toLowerCase())
        .value()
      )
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Update applications metadata.
   */
  api.put('/:id', (req, res, next) => {
    const data = { client_metadata: {
      'sso-dashboard-enabled': req.body.enabled,
      'sso-dashboard-type': req.body.type,
      'sso-dashboard-logo': req.body.logo
    }};
    const params = { client_id: req.params.id };

    req.auth0.clients.update(params, data)
      .then(clients => res.json(clients))
      .catch(next);
  });

  return api;
};
