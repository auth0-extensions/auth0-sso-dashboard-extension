import _ from 'lodash';
import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import applications from '../../../server/routes/applications';

describe('#applications router', () => {
  const defaultClients = [
    {
      name: 'Client 1',
      client_id: '1',
      global: false
    },
    {
      name: 'Client 2',
      client_id: '2',
      global: false
    },
    {
      name: 'Global Client',
      client_id: '3',
      global: true
    }
  ];

  const defaultApps = {
    appOne: {
      name: 'App One',
      enabled: true,
      loginUrl: 'http://some.url'
    },
    appTwo: {
      name: 'App Two',
      enabled: false,
      loginUrl: ''
    }
  };

  const newApp = {
    name: 'App Three',
    client: '1',
    enabled: true,
    type: 'oidc',
    logo: '',
    connection: 'connection',
    callback: 'http://callback.url'
  };

  const fakeApiClient = (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.auth0 = {
      clients: {
        getAll: () => Promise.resolve(defaultClients)
      }
    };

    next();
  };

  const addUserToReq = (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.user = {
      scope: [ 'read:applications', 'manage:applications' ]
    };
    next();
  };

  const storage = {
    read: () => Promise.resolve(storage.data),
    write: (data) => {
      storage.data = data;
      return Promise.resolve();
    },
    data: {
      applications: defaultApps
    }
  };

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/applications', addUserToReq, applications(fakeApiClient, storage));

  describe('#Applications', () => {
    it('should return list of clients from auth0', (done) => {
      request(app)
        .get('/applications/clients')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultClients.slice(0, 3));
          done();
        });
    });

    it('should return list of applications from storage', (done) => {
      request(app)
        .get('/applications/all')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(_.map(defaultApps, (item, id) => ({ ...item, id })));
          done();
        });
    });

    it('should return list of enabled applications from storage', (done) => {
      request(app)
        .get('/applications')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual([ { ...defaultApps.appOne, id: 'appOne' } ]);
          done();
        });
    });

    it('should return one application', (done) => {
      request(app)
        .get('/applications/appOne')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ application: defaultApps.appOne });
          done();
        });
    });

    it('should create new application (oidc)', (done) => {
      request(app)
        .post('/applications')
        .send(newApp)
        .expect(201)
        .end((err, res) => {
          const newAppId = res.body.id;
          expect(storage.data.applications[newAppId].type).toEqual('oidc');
          if (err) throw err;
          done();
        });
    });

    it('should create new application (wsfed)', (done) => {
      newApp.type = 'wsfed';
      request(app)
        .post('/applications')
        .send(newApp)
        .expect(201)
        .end((err, res) => {
          const newAppId = res.body.id;
          expect(storage.data.applications[newAppId].type).toEqual('wsfed');
          if (err) throw err;
          done();
        });
    });

    it('should create new application (saml)', (done) => {
      newApp.type = 'saml';
      request(app)
        .post('/applications')
        .send(newApp)
        .expect(201)
        .end((err, res) => {
          const newAppId = res.body.id;
          expect(storage.data.applications[newAppId].type).toEqual('saml');
          if (err) throw err;
          done();
        });
    });

    it('should update application', (done) => {
      request(app)
        .put('/applications/appOne')
        .send({ enabled: false })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(storage.data.applications.appOne.enabled).toEqual(false);
          done();
        });
    });

    it('should remove application', (done) => {
      request(app)
        .delete('/applications/appOne')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(storage.data.applications.appOne).toNotExist();
          done();
        });
    });
  });
});
