/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import { setProvider } from '../../../server/lib/config';
import { getResourceServer, removeGrant } from '../../../server/lib/queries';

describe('queries', () => {
  before(() => {
    setProvider(() => 'auth0.example.com');
  });

  describe('getResourceServer', () => {
    it('should fetch the resource servers with pagination', () => {
      const req =  {
        auth0: {
          resourceServers: {
            getAll: sinon.spy(() => {
              return Promise.resolve({ total: 1, resource_servers: [{ identifier: 'http://audience' }] });
            })
          }
        }
      };
      return getResourceServer(req, 'http://audience').then((resourceServer) => {
        expect(resourceServer).to.eql({ identifier: 'http://audience' });
        sinon.assert.calledOnce(req.auth0.resourceServers.getAll);
        sinon.assert.calledWith(req.auth0.resourceServers.getAll, { include_totals: true, page: 0, per_page: 100 });
      });
    });
  });

  describe('removeGrant', () => {
    afterEach(() => {
      nock.restore();
    });

    it('should delete the grant if it exists', () => {
      const get = nock('https://auth0.example.com')
        .get('/api/v2/client-grants')
        .query({ client_id: 'auth0.example.com',audience: 'urn:auth0-authz-api' })
        .reply(200, [ { client_id: 'auth0.example.com',audience: 'urn:auth0-authz-api', id: 'id1' }]);

      const del = nock('https://auth0.example.com')
        .delete('/api/v2/client-grants/id1')
        .reply(204)

      const req =  {
        user: {
          access_token: 'token'
        }
      };
      return removeGrant(req).then(() => {
        get.done();
        del.done();
      });
    });
  });
});
