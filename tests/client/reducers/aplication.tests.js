import expect from 'expect';
import { application } from '../../../client/reducers/application';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  appId: null,
  record: {},
  currentType: null,
  currentClient: null
};

describe('application reducer', () => {
  it('should return the initial state', () => {
    expect(
      application(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle APPLICATION_CLIENT_CHANGE', () => {
    expect(
      application(initialState, {
        type: constants.APPLICATION_CLIENT_CHANGE,
        meta: {
          client: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        appId: null,
        record: {},
        currentType: null,
        currentClient: 1
      }
    );
  });

  it('should handle APPLICATION_TYPE_CHANGE', () => {
    expect(
      application(initialState, {
        type: constants.APPLICATION_TYPE_CHANGE,
        meta: {
          type: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        appId: null,
        record: {},
        currentType: 1,
        currentClient: null
      }
    );
  });

  it('should handle FETCH_APPLICATION_PENDING', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_APPLICATION_PENDING,
        meta: {
          appId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        appId: 1,
        record: {},
        currentType: null,
        currentClient: null
      }
    );
  });

  it('should handle FETCH_APPLICATION_REJECTED', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_APPLICATION_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the application: ERROR',
        appId: null,
        record: {},
        currentType: null,
        currentClient: null
      }
    );
  });

  it('should handle FETCH_APPLICATION_FULFILLED', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_APPLICATION_FULFILLED,
        payload: {
          data: {
            application: { id: 2, name: 'test', type: 'test', client: 'test' }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        appId: null,
        record: { id: 2, name: 'test', type: 'test', client: 'test' },
        currentType: 'test',
        currentClient: 'test'
      }
    );
  });
});
