import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

const defaultStorage = { };

/*
 * Read from Webtask storage or local file.
 */
export const readStorage = (storageContext) => {
  if (!storageContext) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '../data.json'), 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(data || '{ }'));
      });
    });
  }

  return new Promise((resolve, reject) => {
    storageContext.get((err, webtaskData) => {
      if (err) {
        return reject(err);
      }

      const data = webtaskData || defaultStorage;
      return resolve(data);
    });
  });
};

/*
 * Write to Webtask storage or local file.
 */
export const writeStorage = (storageContext, data) => {
  if (!storageContext) {
    return readStorage(storageContext)
      .then((originalData) => ({ ...originalData, ...data }))
      .then((mergedData) => new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, '../data.json'), JSON.stringify(mergedData, null, 2), 'utf8', (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      }));
  }

  return new Promise((resolve, reject) => {
    storageContext.set(data, { force: 1 }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
