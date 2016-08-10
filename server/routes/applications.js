import _ from 'lodash';
import { Router } from 'express';
import { Auth0 } from 'auth0';
import { readStorage, writeStorage } from '../lib/storage';
import { NotFoundError, ArgumentError } from '../lib/errors';
import config from '../lib/config';
import { managementClient, isAdmin } from '../lib/middlewares';

const saveApplication = (id, body, storage) =>
  new Promise((resolve, reject) => {
    const data = {
      [id]: {
        'name': body.name,
        'client': body.client,
        'enabled': body.enabled,
        'type': body.type,
        'logo': body.logo,
        'callback': body.callback
      }
    };

    if (body.type === 'openid') {
      data[id].response_type = body.response_type || 'code';
      data[id].scope = body.scope || 'openid';
    }

    writeStorage(storage, data)
      .then(resolve)
      .catch(reject);
  });

export default (storage) => {
  const api = Router();

  api.post('/auth/:id', (req, res, next) => {
    readStorage(storage)
      .then(apps => apps[req.params.id])
      .then(app => {
        const authProtocol = app.type;
        const callback = app.callback || '';
        const domain = config("AUTH0_DOMAIN");
        const client_id = app.client;
        const responseType = app.response_type || 'code';
        const scope = app.scope || 'openid';
        let loginUrl = '';

        switch (authProtocol) {
          case 'saml':
            loginUrl = `https://${domain}/samlp/${client_id}`;
            break;
          case 'ws-fed':
            loginUrl = `https://${domain}/wsfed/${client_id}?wreply=${callback}`;
            break;
          case 'openid':
            loginUrl = `https://${domain}/authorize?response_type=${responseType}&scope=${scope}&client_id=${client_id}&redirect_uri=${callback}`;
            break;
        }

        if (!app || !client_id) return next(new NotFoundError('Application not found'));
        if (!loginUrl) return next(new ArgumentError('Unknown auth protocol'));
        res.redirect(loginUrl);
      })
      .catch(next);
  });

  /*
   * Get a list of all clients.
   */
  api.get('/clients', isAdmin, (req, res, next) => {
    req.auth0.clients.getAll()
      .then(clients => _.filter(clients, (client) => !client.global))
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Get a list of applications.
   */
  api.get('/', (req, res, next) => {
    readStorage(storage)
      .then(apps => res.json(apps))
      .catch(next);
  });

  /*
   * Get application.
   */
  api.get('/:id', (req, res, next) => {
    readStorage(storage)
      .then(apps => res.json(apps[req.params.id]))
      .catch(next);
  });

  /*
   * Update application.
   */
  api.put('/:id', isAdmin, (req, res, next) => {
    saveApplication(req.params.id, req.body, storage)
      .then(res.status(200).send)
      .catch(next);
  });

  /*
   * Create application.
   */
  api.post('/', isAdmin, (req, res, next) => {
    const id = new Date().getTime().toString();

    saveApplication(id, req.body, storage)
      .then(res.status(201).send)
      .catch(next);
  });

  return api;
};
