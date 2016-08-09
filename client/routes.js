import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={containers.RequireAuthentication(containers.App)}>
      <IndexRedirect to="/applications" />
      <Route path="applications" component={containers.Applications} />
      <Route path="applications/:id" component={containers.Application} />
    </Route>
    <Route path="/login" component={containers.Login} />
  </Router>;
