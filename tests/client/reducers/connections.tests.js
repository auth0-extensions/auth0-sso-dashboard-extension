import expect from 'expect';
import { connections } from '../../../client/reducers/connections';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: []
};

describe('connections reducer', () => {
  it('should return the initial state', () => {
    expect(
      connections(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_CONNECTIONS_PENDING', () => {
    expect(
      connections(initialState, {
        type: constants.FETCH_CONNECTIONS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: []
      }
    );
  });

  it('should handle FETCH_CONNECTIONS_REJECTED', () => {
    expect(
      connections(initialState, {
        type: constants.FETCH_CONNECTIONS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the connections: ERROR',
        records: []
      }
    );
  });

  it('should handle FETCH_CONNECTIONS_FULFILLED', () => {
    expect(
      connections(initialState, {
        type: constants.FETCH_CONNECTIONS_FULFILLED,
        payload: { data: [{ id: 2, name: 'test' }, { id: 3, name: 'test_3' }] }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [{ id: 2, name: 'test' }, { id: 3, name: 'test_3' }]
      }
    );
  });
});
