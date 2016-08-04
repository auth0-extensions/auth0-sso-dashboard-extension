import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { connections } from './connections';
import { mfa } from './mfa';
import { block } from './block';
import { unblock } from './unblock';
import { log } from './log';
import { logs } from './logs';
import { user } from './user';
import { userPicker } from './userPicker';
import { users } from './users';
import { deleteUser } from './deleteUser';
import { passwordReset } from './passwordReset';
import { passwordChange } from './passwordChange';

export default combineReducers({
  routing: routerReducer,
  applications,
  connections,
  auth,
  mfa,
  block,
  unblock,
  log,
  logs,
  passwordChange,
  passwordReset,
  deleteUser,
  user,
  users,
  userPicker,
  form: formReducer
});
