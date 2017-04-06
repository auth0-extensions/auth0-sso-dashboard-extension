import Promise from 'bluebird';

/*
 * Save the group to webtask storage.
 */
export const saveGroup = (id, body, storage) => new Promise((resolve, reject) => {

  // Save.
  storage.read()
    .then(originalData => {
      originalData = originalData || {};  // eslint-disable-line no-param-reassign
      originalData.groups = originalData.groups || {}; // eslint-disable-line no-param-reassign
      originalData.groups[id].name = body.name; // eslint-disable-line no-param-reassign

      return storage.write(originalData)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
});

/*
 * Delete the group from webtask storage.
 */
export const deleteGroup = (id, storage) =>
  new Promise((resolve, reject) => {
    storage.read()
      .then(originalData => {
        originalData.groups[id] = null;  // eslint-disable-line no-param-reassign
        delete originalData.groups[id];  // eslint-disable-line no-param-reassign

        return storage.write(originalData)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
