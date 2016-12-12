import expect from 'expect';
import { deleteApplication } from '../../../client/reducers/deleteApplication';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  requesting: false,
  appId: null
};

describe('delete application reducer', () => {
  it('should return the initial state', () => {
    expect(
      deleteApplication(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_APPLICATION_DELETE', () => {
    expect(
      deleteApplication(initialState, {
        type: constants.REQUEST_APPLICATION_DELETE,
        meta: {
          appId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        requesting: true,
        appId: 1
      }
    );
  });

  it('should handle CANCEL_APPLICATION_DELETE', () => {
    expect(
      deleteApplication(initialState, {
        type: constants.CANCEL_APPLICATION_DELETE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_APPLICATION_PENDING', () => {
    expect(
      deleteApplication(initialState, {
        type: constants.DELETE_APPLICATION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        requesting: false,
        appId: null
      }
    );
  });

  it('should handle DELETE_APPLICATION_REJECTED', () => {
    expect(
      deleteApplication(initialState, {
        type: constants.DELETE_APPLICATION_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the applications: ERROR',
        requesting: false,
        appId: null
      }
    );
  });

  it('should handle DELETE_APPLICATION_FULFILLED', () => {
    expect(
      deleteApplication(initialState, {
        type: constants.DELETE_APPLICATION_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        requesting: false,
        appId: null
      }
    );
  });
});
