import Promise from 'bluebird';
import { ValidationError } from 'auth0-extension-tools';

import { addGrant, removeGrant, getResourceServer } from './queries';

export const getStatus = (req, storage) =>
  storage.read()
    .then((data) => {
      const result = { authorizationEnabled: data.authorizationEnabled };

      return getResourceServer(req, 'urn:auth0-authz-api')
        .then((resourceServer) => {
          result.authorizationApiAvailable = !!resourceServer;

          return result;
        });
    });

export const enable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (data.authorizationEnabled) {
        return Promise.resolve();
      }

      return getResourceServer(req, 'urn:auth0-authz-api')
        .then((resourceServer) => {
          if (!resourceServer) {
            const error = new ValidationError('Authorization API not found.');
            error.status = 400;
            return Promise.reject(error);
          }

          return addGrant(req)
            .then(() => {
              data.authorizationEnabled = true;
              return storage.write(data);
            });
        });
    });

export const disable = (req, storage) =>
  storage.read()
    .then((data) => {
      if (!data.authorizationEnabled) {
        return Promise.resolve();
      }

      return removeGrant(req)
        .then(() => {
          data.authorizationEnabled = false;
          return storage.write(data);
        });
    });
