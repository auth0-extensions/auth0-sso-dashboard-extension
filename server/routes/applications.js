import _ from 'lodash';
import { Router } from 'express';
import { Auth0 } from 'auth0';
import { managementClient, isAdmin } from '../lib/middlewares';

export default () => {
  const api = Router();

  api.post('/auth/:id', (req, res, next) => {
    const auth0 = new Auth0({
      domain:       req.body.domain,
      clientID:     req.params.id,
      callbackURL:  req.body.callback,
      callbackOnLocationHash: true
    });

    auth0.login({}, (err, result) => {
      console.log(err, result);
      if (err) return next(err);

      res.redirect(req.body.callback)
    });
  });

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
    req.auth0.clients.get({ client_id: req.params.id })
    .then(application => res.json({ application }))
    .catch(next);
  });

  /*
   * Update applications metadata.
   */
  api.put('/:id', isAdmin, (req, res, next) => {
    const data = { client_metadata: {
      'sso-dashboard-enabled': req.body['sso-dashboard-enabled'],
      'sso-dashboard-type': req.body['sso-dashboard-type'],
      'sso-dashboard-logo': req.body['sso-dashboard-logo'],
      'sso-dashboard-callback': req.body['sso-dashboard-callback']
    }};
    const params = { client_id: req.params.id };

    req.auth0.clients.update(params, data)
      .then(clients => res.json(clients))
      .catch(next);
  });

  return api;
};
