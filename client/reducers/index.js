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
import { createApplication } from './createApplication';
import { updateApplication } from './updateApplication';
import { deleteApplication } from './deleteApplication';

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
  createApplication,
  updateApplication,
  deleteApplication,
  form: formReducer
});
