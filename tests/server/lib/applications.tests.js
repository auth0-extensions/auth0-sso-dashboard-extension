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
    moveApplication('app3', 'up', storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app1');
        expect(Object.keys(storageData.applications)[1]).to.equal('app3');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should move application DOWN', (done) => {
    moveApplication('app1', 'down', storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app3');
        expect(Object.keys(storageData.applications)[1]).to.equal('app1');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should NOT move FIRST application UP', (done) => {
    moveApplication('app3', 'up', storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app3');
        expect(Object.keys(storageData.applications)[1]).to.equal('app1');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });

  it('should NOT move LAST application DOWN', (done) => {
    moveApplication('app2', 'down', storage)
      .then(() => {
        expect(Object.keys(storageData.applications)[0]).to.equal('app3');
        expect(Object.keys(storageData.applications)[1]).to.equal('app1');
        expect(Object.keys(storageData.applications)[2]).to.equal('app2');
        done();
      });
  });
});
