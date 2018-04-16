const Promise = require('bluebird');
const authenticationUrl = require('./authenticationUrl');

/*
 * Save the application to webtask storage.
 */
const saveApplication = (id, body, storage) => new Promise((resolve, reject) => {
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
    .then((originalData) => {
      originalData = originalData || {}; // eslint-disable-line no-param-reassign
      originalData.applications = originalData.applications || {}; // eslint-disable-line no-param-reassign
      originalData.applications[id] = data; // eslint-disable-line no-param-reassign

      return storage.write(originalData)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
});

/*
 * Delete the application from webtask storage.
 */
const deleteApplication = (id, storage) =>
  new Promise((resolve, reject) => {
    storage.read()
      .then((originalData) => {
        originalData.applications[id] = null; // eslint-disable-line no-param-reassign
        delete originalData.applications[id]; // eslint-disable-line no-param-reassign

        return storage.write(originalData)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

module.exports = {
  saveApplication,
  deleteApplication
};

