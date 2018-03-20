const _ = require('lodash');
const uuid = require('uuid');
const { Router } = require('express');

const { requireScope } = require('../lib/middlewares');
const { saveApplication, deleteApplication } = require('../lib/applications');
const { getGroupsForUser } = require('../lib/queries');
const { hasGroup } = require('../lib/user');


module.exports = (auth0, storage) => {
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
      .then(() => storage.read())
      .then((data) => {
        if (data.authorizationEnabled) {
          return getGroupsForUser(req.user.sub);
        }

        return null;
      })
      .then((userGroups) => {
        const result = { };

        Object.keys(applications).map((key) => {
          const app = applications[key];
          if (app.enabled && app.loginUrl && (hasGroup(userGroups, app.groups))) {
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
