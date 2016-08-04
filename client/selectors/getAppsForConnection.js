import { createSelector } from 'reselect';

const getApps = (state) =>
  state.applications.get('records');

const getConnection = (state, connectionName) =>
  connectionName && state.connections.get('records').find(conn => conn.get('name') === connectionName);

const getAppsForConnection = createSelector(
  [ getApps, getConnection ],
  (apps, connection) => apps.filter(app => connection && connection.get('enabled_clients').indexOf(app.get('client_id')) >= 0)
);

export default getAppsForConnection;
