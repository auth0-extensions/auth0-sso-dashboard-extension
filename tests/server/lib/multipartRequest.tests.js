/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import multipartRequest from '../../../server/lib/multipartRequest';

describe('multipartRequest', () => {
  it('should fetch all pages by calling getAll on its manager so SDK methods keep their context', () => {
    // Mimics newer Auth0 SDK managers, where getAll is a prototype method that relies on `this`.
    class Manager {
      constructor() {
        this.resource = {
          getAll: ({ page }) => {
            if (page === 0) {
              return Promise.resolve({ total: 3, resource_servers: [ { id: 'a' }, { id: 'b' } ] });
            }

            return Promise.resolve(page === 1 ? [ { id: 'c' } ] : []);
          }
        };
      }

      getAll(params) {
        return this.resource.getAll(params);
      }
    }

    return multipartRequest({ resourceServers: new Manager() }, 'resourceServers', {}, 2).then((result) => {
      expect(result.map(item => item.id)).to.eql([ 'a', 'b', 'c' ]);
    });
  });
});
