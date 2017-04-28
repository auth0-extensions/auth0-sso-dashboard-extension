import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import groups from '../../../server/routes/groups';

describe('#logs router', () => {
  const defaultGroups = {
    groupOne: {
      name: 'Test group #1'
    },
    groupTwo: {
      name: 'Test group #2'
    }
  };

  const newGroup = {
    name: 'Test group #3'
  };

  const addUserToReq = (req, res, next) => {
    req.user = { };
    next();
  };

  const storage = {
    read: () => Promise.resolve(storage.data),
    write: (data) => {
      storage.data = data;
      return Promise.resolve();
    },
    data: {
      groups: defaultGroups
    }
  };

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/application-groups', addUserToReq, groups(storage));

  describe('#Applications', () => {
    it('should return list of applications from storage', (done) => {
      request(app)
        .get('/application-groups/all')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultGroups);
          done();
        });
    });

    it('should return one group', (done) => {
      request(app)
        .get('/application-groups/groupOne')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ application: defaultGroups.groupOne });
          done();
        });
    });

    it('should create new group', (done) => {
      request(app)
        .post('/application-groups')
        .send(newGroup)
        .expect(201)
        .end((err, res) => {
          const newGroupId = res.body.id;
          expect(storage.data.applications[newGroupId].name).toEqual(newGroup.name);
          if (err) throw err;
          done();
        });
    });

    it('should update group', (done) => {
      const newGroupName = 'Modified group #1';
      request(app)
        .put('/application-groups/groupOne')
        .send({ name: newGroupName })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(storage.data.applications.groupOne.name).toEqual(newGroupName);
          done();
        });
    });

    it('should remove group', (done) => {
      request(app)
        .delete('/application-groups/groupOne')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(storage.data.applications.groupOne).toNotExist();
          done();
        });
    });
  });
});
