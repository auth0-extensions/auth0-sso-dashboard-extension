import _ from 'lodash';
import uuid from 'uuid';
import { Router } from 'express';

import { requireScope } from '../lib/middlewares';
import { saveApplication, deleteApplication } from '../lib/applications';
import { getGroupsForUser } from '../lib/authz';
import { hasRole } from '../lib/user';


export default (auth0, storage) => {
  const api = Router();
  api.get('/clients', auth0, requireScope('manage:applications'), (req, res, next) => {
    req.auth0.clients.getAll({ fields: 'client_id,name,callbacks,global,app_type' })
      .then(clients => _.chain(clients)
        .filter(client => !client.global)
        .sortBy((client) => client.name.toLowerCase())
        .value()
      )
      .then(clients => res.json(clients))
      .catch(next);
  });

  api.get('/', requireScope('read:applications'), (req, res, next) => {
    let applications;
    storage.read()
      .then(apps => {
        applications = apps.applications || { };
        return null;
      })
      .then(() => getGroupsForUser(req.user.sub))
      .then((userRoles) => {
        const result = { };

        Object.keys(applications).map((key) => {
          const app = applications[key];
          if (app.enabled && app.loginUrl && (hasRole(userRoles, app.roles))) {
            result[key] = app;
          }
          return app;
        });

        return result;
      })
      .then(apps => res.json(apps))
      .catch(next);
  });

  /*
   * Get a list of applications.
   */
  api.get('/all', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(apps => res.json(apps.applications || {}))
      .catch(next);
  });

  /*
   * Get application.
   */
  api.get('/:id', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(apps => res.json({ application: apps.applications[req.params.id] }))
      .catch(next);
  });

  /*
   * Update application.
   */
  api.put('/:id', requireScope('manage:applications'), (req, res, next) => {
    saveApplication(req.params.id, req.body, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });

  /*
   * Create application.
   */
  api.post('/', requireScope('manage:applications'), (req, res, next) => {
    const id = uuid.v4();
    saveApplication(id, req.body, storage)
      .then(() => res.status(201).send({ id }))
      .catch(next);
  });

  /*
   * Delete application.
   */
  api.delete('/:id', requireScope('manage:applications'), (req, res, next) => {
    deleteApplication(req.params.id, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });
  return api;
};
