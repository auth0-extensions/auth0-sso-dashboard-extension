const { expect } = require('chai'); // eslint-disable-line import/no-extraneous-dependencies
const config = require('../../../server/lib/config');
const { setProvider } = require('../../../server/lib/config');

describe('config', () => {
  describe('#get', () => {
    it('should return setting from provider if configured', () => {
      setProvider((key) => {
        if (key === 'DUMMY_KEY') {
          return 'CUSTOM_VALUE';
        }
        return 12345;
      });
      expect(config('DUMMY_KEY')).to.equal('CUSTOM_VALUE');
    });
  });
});
