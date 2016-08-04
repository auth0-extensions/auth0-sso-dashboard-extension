import { Router } from 'express';
import request from 'request-promise';

import config from '../lib/config';
import managementApiClient from '../lib/managementApiClient';
import authenticationApiClient from '../lib/authenticationApiClient';

export default () => {
  const api = Router();

  api.get('/', (req, res, next) => {
    const options = {
      sort: 'last_login:-1',
      q: req.query.search,
      per_page: req.query.per_page || 100,
      page: req.query.page || 0,
      include_totals: true,
      fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
      search_engine: 'v2'
    };

    req.auth0.users.getAll(options)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    req.auth0.users.get({ id: req.params.id })
      .then(user => res.json({ user }))
      .catch(next);
  });

  api.delete('/:id', (req, res, next) => {
    req.auth0.users.delete({ id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.post('/:email/password-reset', (req, res, next) => {
    authenticationApiClient.getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'))
      .then(auth0 => auth0.database.requestChangePasswordEmail({ email: req.params.email, connection: req.body.connection, client_id: req.body.clientId }))
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.post('/:id/password-change', (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
      return next(new Error('Passwords don\'t match'));
    }

    return req.auth0.users.update({ id: req.params.id }, { password: req.body.password, connection: req.body.connection, verify_password: false })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.get('/:id/devices', (req, res, next) => {
    req.auth0.deviceCredentials.getAll({ user_id: req.params.id })
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  api.get('/:id/logs', (req, res, next) => {
    managementApiClient.getAccessToken(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
      .then(accessToken => {
        const options = {
          uri: `https://${config('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(req.params.id)}/logs`,
          qs: {
            include_totals: true
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          },
          json: true
        };

        return request.get(options);
      })
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.delete('/:id/multifactor/:provider', (req, res, next) => {
    req.auth0.users.deleteMultifactorProvider({ id: req.params.id, provider: req.params.provider })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.post('/:id/block', (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: true })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.post('/:id/unblock', (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: false })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
