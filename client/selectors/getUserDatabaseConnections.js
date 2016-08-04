import { createSelector } from 'reselect';

const getUserIdentities = (state) =>
  state.user.get('record') && state.user.get('record').get('identities');

const getUserDatabaseConnections = createSelector(
  [ getUserIdentities ],
  (identities) =>
    identities && identities
      .filter(identity => identity.get('provider') === 'auth0')
      .map(identity => identity.get('connection'))
);

export default getUserDatabaseConnections;
