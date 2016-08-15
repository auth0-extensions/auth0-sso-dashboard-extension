import _ from 'lodash';
import uuid from 'uuid';
import {Router} from 'express';
import {Auth0} from 'auth0';
import {readStorage, writeStorage} from '../lib/storage';
import {NotFoundError, ArgumentError} from '../lib/errors';
import config from '../lib/config';
import {managementClient, isAdmin} from '../lib/middlewares';

const saveApplication = (id, body, storage) =>
  new Promise((resolve, reject) => {
    const data = {
      'name': body.name,
      'client': body.client,
      'enabled': body.enabled,
      'type': body.type,
      'logo': body.logo,
      'callback': body.callback
    };

    if (body.type === 'openid') {
      data.response_type = body.response_type || 'code';
      data.scope = body.scope || 'openid';
    }

    attachAuthUrl(data);

    readStorage(storage)
      .then(originalData => {
        originalData = originalData || {applications: {}};
        originalData.applications[id] = data;

        return writeStorage(storage, originalData)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

const deleteApplication = (id, storage) =>
  new Promise((resolve, reject) => {
    readStorage(storage)
      .then(originalData => {
        originalData.applications[id] = null;
        delete originalData.applications[id];

        return writeStorage(storage, originalData)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

const attachAuthUrl = (app) => {
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

  if (app.connection) {
    loginUrl += (authProtocol === 'ws-fed') ? '&wreply=' : '&connection=';
    loginUrl += app.connection;
  }

  app.login_url = loginUrl;

  return app;
};


export default (storage) => {
  const api = Router();

  /*
   * Get a list of all clients.
   */
  api.get('/clients', isAdmin, (req, res, next) => {
    req.auth0.clients.getAll({ fields: 'name,client_id,callbacks' })
      .then(clients => _.filter(clients, (client) => !client.global))
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Get a list of applications.
   */
  api.get('/', (req, res, next) => {
    readStorage(storage)
      .then(apps => {
        const applications = apps.applications || {};
        const result = {};

        Object.keys(applications).map((key) => {
          const app = applications[key];

          if (app.enabled && app.login_url) {
            result[key] = app;
          }
        });

        return result;
      })
      .then(apps => res.json(apps))
      .catch(next);
  });

  /*
   * Get a list of applications.
   */
  api.get('/all', (req, res, next) => {
    readStorage(storage)
      .then(apps => res.json(apps.applications || {}))
      .catch(next);
  });

  /*
   * Get application.
   */
  api.get('/:id', (req, res, next) => {
    readStorage(storage)
      .then(apps => res.json({application: apps.applications[req.params.id]}))
      .catch(next);
  });

  /*
   * Update application.
   */
  api.put('/:id', isAdmin, (req, res, next) => {
    saveApplication(req.params.id, req.body, storage)
      .then(() => res.status(200).send())
      .catch(next);
  });

  /*
   * Create application.
   */
  api.post('/', isAdmin, (req, res, next) => {
    const id = uuid.v4();

    saveApplication(id, req.body, storage)
      .then(() => res.status(201).send())
      .catch(next);
  });

  /*
   * Delete application.
   */
  api.delete('/:id', isAdmin, (req, res, next) => {
    deleteApplication(req.params.id, storage)
      .then(() => res.status(200).send())
      .catch(next);
  });

  return api;
};
