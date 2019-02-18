/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import { moveApplication } from '../../../server/lib/applications';

let storageData = {
  applications: {
    app1: {
      name: 'First App'
    },
    app2: {
      name: 'First Two'
    },
    app3: {
      name: 'First Three'
    }
  }
};

const storage = {
  read: () => Promise.resolve(storageData),
  write: (data) => {
    storageData = data;
    Promise.resolve();
  }
};

describe('applications', () => {
  it('should move application UP', (done) => {
    moveApplication('app3', -1, storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app1');
        expect(Object.keys(storageData.applications)[1]).to.equal('app3');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should move application DOWN', (done) => {
    moveApplication('app1', 1, storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app3');
        expect(Object.keys(storageData.applications)[1]).to.equal('app1');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should move application UP to two positions', (done) => {
    moveApplication('app2', -2, storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app2');
        expect(Object.keys(storageData.applications)[1]).to.equal('app3');
        expect(Object.keys(storageData.applications)[2]).to.equal('app1');
        done();
      });
  });

  it('should move application DOWN to two positions', (done) => {
    moveApplication('app2', 2, storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app3');
        expect(Object.keys(storageData.applications)[1]).to.equal('app1');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should return error when trying to move non-existing app', (done) => {
    moveApplication('app4', 1, storage)
      .catch((err) => {
        expect(err.message).to.equal('Application "app4" not found.');
        done();
      });
  });

  it('should return error when trying to move app beyond the limits', (done) => {
    moveApplication('app3', -3, storage)
      .catch((err) => {
        expect(err.message).to.equal('Application "app3" cannot be moved to "-3" position.');
        done();
      });
  });
});
