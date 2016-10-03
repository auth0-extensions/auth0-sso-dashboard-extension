import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { compose, createStore, applyMiddleware } from 'redux';

import rootReducer from '../reducers';
import normalizeErrorMiddleware from '../middlewares/normalizeErrorMiddleware';
import promiseSuccessMiddleware from '../middlewares/promiseSuccessMiddleware';
import DevTools from '../containers/DevTools';

const nextRootReducer = (process.env.NODE_ENV !== 'production' && module.hot) ? require('../reducers') : null;

export default function configureStore(middlewares, initialState = { }) {
  const pipeline = [
    applyMiddleware(
      promiseMiddleware(),
      thunkMiddleware,
      normalizeErrorMiddleware(),
      promiseSuccessMiddleware(),
      createLogger({
        predicate: () => process.env.NODE_ENV !== 'production'
      }),
      ...middlewares
    )
  ];

  if (process.env.NODE_ENV !== 'production') {
    pipeline.push(DevTools.instrument());
  }

  const finalCreateStore = compose(...pipeline)(createStore);
  const store = finalCreateStore(rootReducer, initialState);

  // Enable Webpack hot module replacement for reducers.
  if (nextRootReducer) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
