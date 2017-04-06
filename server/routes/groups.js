import uuid from 'uuid';
import { Router } from 'express';

import { saveGroup, deleteGroup } from '../lib/groups';

export default (auth0, storage) => {
  const api = Router();

  api.get('/', (req, res, next) => {
    storage.read()
      .then(data => {
        const groups = data.groups || { };
        const apps = data.applications || { };
        const result = {};

        Object.keys(groups).map((groupKey) => {
          const group = groups[groupKey];
          group.apps = [];

          Object.keys(apps).map((appKey) => {
            const app = apps[appKey];
            if (app.groupId === groupKey) group.apps.push(appKey);
          });

          if (group.apps.length > 0) {
            result[groupKey] = group;
          }
          return group;
        });

        return result;
      })
      .then(data => res.json(data))
      .catch(next);
  });

  /*
   * Get all the groups.
   */
  api.get('/all', (req, res, next) => {
    storage.read()
      .then(data => res.json(data.groups || {}))
      .catch(next);
  });

  /*
   * Get group.
   */
  api.get('/:id', (req, res, next) => {
    storage.read()
      .then(data => res.json({ group: data.groups[req.params.id] }))
      .catch(next);
  });

  /*
   * Update group.
   */
  api.put('/:id', (req, res, next) => {
    saveGroup(req.params.id, req.body, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });

  /*
   * Create group.
   */
  api.post('/', (req, res, next) => {
    const id = uuid.v4();
    saveGroup(id, req.body, storage)
      .then(() => res.status(201).send({ id }))
      .catch(next);
  });

  /*
   * Delete group.
   */
  api.delete('/:id', (req, res, next) => {
    deleteGroup(req.params.id, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });
  return api;
};
