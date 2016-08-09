import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { application } from './application';
import { status } from './status';
import { connections } from './connections';
import { mfa } from './mfa';

export default combineReducers({
  routing: routerReducer,
  applications,
  application,
  status,
  connections,
  auth,
  mfa,
  form: formReducer
});
