import expect from 'expect';
import { createApplication } from '../../../client/reducers/createApplication';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  requesting: false
};

describe('create application reducer', () => {
  it('should return the initial state', () => {
    expect(
      createApplication(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_APPLICATION_CREATE', () => {
    expect(
      createApplication(initialState, {
        type: constants.REQUEST_APPLICATION_CREATE
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        requesting: true
      }
    );
  });

  it('should handle CANCEL_APPLICATION_CREATE', () => {
    expect(
      createApplication(initialState, {
        type: constants.CANCEL_APPLICATION_CREATE
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        requesting: false
      }
    );
  });

  it('should handle CREATE_APPLICATION_PENDING', () => {
    expect(
      createApplication(initialState, {
        type: constants.CREATE_APPLICATION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        requesting: false
      }
    );
  });

  it('should handle CREATE_APPLICATION_REJECTED', () => {
    expect(
      createApplication(initialState, {
        type: constants.CREATE_APPLICATION_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while creating the application: ERROR',
        requesting: false
      }
    );
  });

  it('should handle CREATE_APPLICATION_FULFILLED', () => {
    expect(
      createApplication(initialState, {
        type: constants.CREATE_APPLICATION_FULFILLED
      }).toJSON()
    ).toEqual(
        initialState
    );
  });
});
