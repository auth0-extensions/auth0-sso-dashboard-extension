import expect from 'expect';
import { applications } from '../../../client/reducers/applications';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0
};

describe('applications reducer', () => {
  it('should return the initial state', () => {
    expect(
      applications(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_APPLICATIONS_PENDING', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: [],
        total: 0
      }
    );
  });

  it('should handle FETCH_APPLICATIONS_REJECTED', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the applications: ERROR',
        records: [],
        total: 0
      }
    );
  });

  it('should handle FETCH_APPLICATIONS_FULFILLED', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_FULFILLED,
        payload: { data: [ { id: 2, name: 'test' }, { id: 3, name: 'test_3' } ] }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [ { id: 2, name: 'test' }, { id: 3, name: 'test_3' } ],
        total: 0
      }
    );
  });
});
