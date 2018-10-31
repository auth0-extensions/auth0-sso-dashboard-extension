/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import { setProvider } from '../../../server/lib/config';
import authenticationUrl from '../../../server/lib/authenticationUrl';

describe('authenticationUrl', () => {
  setProvider(() => 'auth0.example.com');

  it('should return saml url with connection', () => {
    const app = {
      type: 'saml',
      scope: 'scope',
      client: 'client',
      callback: 'callback',
      connection: 'connection',
      response_type: 'response_type'
    };

    expect(authenticationUrl(app)).to.equal('https://auth0.example.com/samlp/client?connection=connection');
  });

  it('should return wsfed url with connection', () => {
    const app = {
      type: 'wsfed',
      scope: 'scope',
      client: 'client',
      callback: 'callback',
      connection: 'connection',
      response_type: 'response_type'
    };

    expect(authenticationUrl(app)).to.equal('https://auth0.example.com/wsfed/client?wreply=callback&whr=connection');
  });

  it('should return oidc url with connection', () => {
    const app = {
      type: 'oidc',
      scope: 'scope',
      client: 'client',
      callback: 'callback',
      connection: 'connection',
      response_type: 'response_type'
    };

    expect(authenticationUrl(app)).to.equal('https://auth0.example.com/authorize?response_type=response_type&scope=scope&client_id=client&redirect_uri=callback&connection=connection');
  });
});
