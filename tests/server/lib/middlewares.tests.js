import expect from 'expect';
import request from 'supertest';
import express from 'express';

import * as middlewares from '../../../server/lib/middlewares';


describe('#middlewares', () => {
  const addUserToReq = (req, res, next) => {
    req.user = {};
    next();
  };

  const addAdminToReq = (req, res, next) => {
    req.user = { };
    next();
  };

  const addRoleToReq = (req, res, next) => {
    req.user = { };
    next();
  };

  describe('#getUser', () => {
    it('should set role to 0', (done) => {
      const app = express();

      app.use('/', addUserToReq, middlewares.getUser, (req, res) => {
        res.send({ role: req.user.role });
      });

      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.role).toEqual(0);
          done();
        });
    });

    it('should set role to 1', (done) => {
      const app = express();

      app.use('/', addAdminToReq, middlewares.getUser, (req, res) => {
        res.send({ role: req.user.role });
      });

      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.role).toEqual(constants.ADMIN_ACCESS_LEVEL);
          done();
        });
    });
  });

  describe('#isAdmin', () => {
    it('should return "Only admins can use this endpoint" error', (done) => {
      const app = express();

      app.use('/', addUserToReq, middlewares.isAdmin, (req, res) => {
        res.send({ role: req.user.role });
      });

      request(app)
        .get('/')
        .expect(403)
        .end((err, res) => {
          if (err) throw err;
          expect(res.error).toMatch(/ForbiddenError: Only admins can use this endpoint./);
          done();
        });
    });

    it('should work', (done) => {
      const app = express();

      app.use('/', addRoleToReq, middlewares.isAdmin, (req, res) => {
        res.send({ role: req.user.role });
      });

      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.role).toEqual(constants.ADMIN_ACCESS_LEVEL);
          done();
        });
    });
  });
});
