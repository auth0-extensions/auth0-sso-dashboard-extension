import Promise from 'bluebird';

export const matchWithApps = (data, all = false) => {
  const groups = data.groups || { };
  const apps = data.applications || { };
  const result = {};


  Object.keys(groups).map((groupKey) => {
    const group = groups[groupKey];
    group.apps = [];

    Object.keys(apps).map((appKey) => {
      const app = apps[appKey];
      if (app.group === groupKey) group.apps.push(appKey);
    });

    if (group.apps.length > 0 || all) {
      result[groupKey] = group;
    }
    return group;
  });

  return result;
};

/*
 * Save the group to webtask storage.
 */
export const saveGroup = (id, body, storage) => new Promise((resolve, reject) => {
  
  // Save.
  storage.read()
    .then(originalData => {
      originalData = originalData || {};  // eslint-disable-line no-param-reassign
      originalData.groups = originalData.groups || {}; // eslint-disable-line no-param-reassign

      if (typeof originalData.groups[id] === 'undefined') {
        originalData.groups[id] = {};  // eslint-disable-line no-param-reassign
      }

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
