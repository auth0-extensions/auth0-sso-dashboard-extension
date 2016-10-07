import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';

import * as constants from '../../../server/constants';
import connections from '../../../server/routes/connections';

describe('#logs router', () => {
  const defaultConnections = [
    {
      name: 'connection-a'
    },
    {
      name: 'connection-b'
    }
  ];

  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      connections: {
        getAll: () => Promise.resolve(defaultConnections)
      }
    };

    next();
  };

  const addUserToReq = (req, res, next) => {
    req.user = {
      role: constants.ADMIN_ACCESS_LEVEL
    };
    next();
  };

  const app = express();
  app.use('/connections', fakeApiClient, addUserToReq, connections());

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
