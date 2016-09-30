import expect from 'expect';
import { application } from '../../../client/reducers/application';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  appId: null,
  record: {}
};

describe('application reducer', () => {
  it('should return the initial state', () => {
    expect(
      application(undefined, {}).toJSON()
    ).toEqual(
      initialState
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
        record: {}
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
        record: {}
      }
    );
  });

  it('should handle FETCH_APPLICATION_FULFILLED', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_APPLICATION_FULFILLED,
        payload: {
          data: {
            application: { id: 2, name: 'test' }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        appId: null,
        record: { id: 2, name: 'test' }
      }
    );
  });
});
