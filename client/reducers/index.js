import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { clients } from './clients';
import { application } from './application';
import { status } from './status';
import { connections } from './connections';
import { createApplication } from './createApplication';

export default combineReducers({
  routing: routerReducer,
  applications,
  application,
  clients,
  status,
  connections,
  auth,
  createApplication,
  form: formReducer
});
