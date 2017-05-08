import Promise from 'bluebird';

import { addGrant, removeGrant, getResourceServer } from './queries';

export const enable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (data.authzEnabled) {
        return Promise.resolve();
      }

      return getResourceServer(req, 'urn:auth0-authz-api')
        .then((resourceServer) => {
          if (!resourceServer) {
            const error = new Error('Authz API not found.');
            error.status = 400;
            return Promise.reject(error);
          }

          return addGrant(req)
            .then(() => {
              data.authzEnabled = true;
              return storage.write(data);
            });
        });
    });

export const disable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (!data.authzEnabled) {
        return Promise.resolve();
      }

      return removeGrant(req)
        .then(() => {
          data.authzEnabled = false;
          return storage.write(data);
        })
    });
