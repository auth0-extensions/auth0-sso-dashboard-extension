import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { clients } from './clients';
import { groups } from './groups';
import { group } from './group';
import { application } from './application';
import { status } from './status';
import { connections } from './connections';
import { authorization } from './authorization';
import { updateAuthorization } from './updateAuthorization';
import { createApplication } from './createApplication';
import { updateApplication } from './updateApplication';
import { deleteApplication } from './deleteApplication';
import { groupedApps } from './groupedApps';

export default combineReducers({
  routing: routerReducer,
  applications,
  application,
  clients,
  groups,
  group,
  status,
  connections,
  auth,
  authorization,
  updateAuthorization,
  createApplication,
  updateApplication,
  deleteApplication,
  groupedApps,
  form: formReducer
});
