import expect from 'expect';
import { status } from '../../../client/reducers/status';
import * as constants from '../../../client/constants';

const initialState = {
  isAdmin: false
};

describe('status reducer', () => {
  it('should return the initial state', () => {
    expect(
      status(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_STATUS_PENDING', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_STATUS_PENDING
      }).toJSON()
    ).toEqual(
      {
        isAdmin: false
      }
    );
  });

  it('should handle FETCH_STATUS_REJECTED', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_STATUS_REJECTED
      }).toJSON()
    ).toEqual(
      {
        isAdmin: false
      }
    );
  });

  it('should handle FETCH_STATUS_FULFILLED', () => {
    expect(
      application(initialState, {
        type: constants.FETCH_STATUS_FULFILLED,
        payload: { isAdmin: true }
      }).toJSON()
    ).toEqual(
      {
        isAdmin: true
      }
    );
  });
});
