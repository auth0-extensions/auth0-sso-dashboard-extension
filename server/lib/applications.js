import Promise from 'bluebird';
import { ArgumentError, NotFoundError } from 'auth0-extension-tools';

import authenticationUrl from './authenticationUrl';

/*
 * Save the application to webtask storage.
 */
export const saveApplication = (id, body, storage) => new Promise((resolve, reject) => {
  const data = {
    name: body.name,
    client: body.client,
    enabled: body.enabled,
    type: body.type,
    logo: body.logo,
    connection: body.connection,
    groups: (Array.isArray(body.groups)) ? body.groups : [ body.groups ],
    callback: body.callback,
    customURL: body.customURL,
    customURLEnabled: body.customURLEnabled
  };

  if (body.type === 'oidc') {
    data.response_type = body.response_type || 'code';
    data.scope = body.scope || 'openid';
  }

  // Calculate the login url.
  data.loginUrl = authenticationUrl(data);

  // Save.
  storage.read()
    .then(originalData => {
      originalData = originalData || {};  // eslint-disable-line no-param-reassign
      originalData.applications = originalData.applications || {}; // eslint-disable-line no-param-reassign
      originalData.applications[id] = data;  // eslint-disable-line no-param-reassign

      return storage.write(originalData)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
});

/*
 * Move application to rearrange order.
 */
export const moveApplication = (id, direction, storage) =>
  storage.read()
    .then(data => {
      data.applications = data.applications || {}; // eslint-disable-line no-param-reassign

      const ids = Object.keys(data.applications);
      const currentPosition = ids.indexOf(id);
      const newPosition = currentPosition + direction;

      if (currentPosition < 0) {
        return Promise.reject(new NotFoundError(`Application "${id}" not found.`));
      }

      if (newPosition >= 0 && newPosition < ids.length) {
        const reordered = {};
        ids.splice(newPosition, 0, ids.splice(currentPosition, 1)[0]);

        ids.forEach((key) => {
          reordered[key] = data.applications[key];
        });

        data.applications = reordered; // eslint-disable-line no-param-reassign

        return storage.write(data);
      }

      return Promise.reject(new ArgumentError(`Application "${id}" cannot be moved to "${newPosition}" position.`));
    });

/*
 * Delete the application from webtask storage.
 */
export const deleteApplication = (id, storage) =>
  new Promise((resolve, reject) => {
    storage.read()
      .then(originalData => {
        originalData.applications[id] = null;  // eslint-disable-line no-param-reassign
        delete originalData.applications[id];  // eslint-disable-line no-param-reassign

        return storage.write(originalData)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
