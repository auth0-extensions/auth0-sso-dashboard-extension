import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';

import connections from '../../../server/routes/connections';

describe('#connections router', () => {
  const defaultConnections = [
    {
      name: 'connection-a'
    },
    {
      name: 'connection-b'
    }
  ];

  const fakeApiClient = (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.auth0 = {
      connections: {
        getAll: () => Promise.resolve(defaultConnections)
      }
    };

    next();
  };

  const addUserToReq = (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.user = {
      scope: [ 'manage:applications' ]
    };
    next();
  };

  const app = express();
  app.use('/connections', addUserToReq, connections(fakeApiClient));

  describe('#Connections', () => {
    it('should return list of connections', (done) => {
      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultConnections);
          done();
        });
    });
  });
});
