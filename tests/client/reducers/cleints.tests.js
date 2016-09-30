import expect from 'expect';
import { clients } from '../../../client/reducers/clients';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: []
};

describe('clients reducer', () => {
  it('should return the initial state', () => {
    expect(
      clients(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_CLIENTS_PENDING', () => {
    expect(
      clients(initialState, {
        type: constants.FETCH_CLIENTS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: []
      }
    );
  });

  it('should handle FETCH_CLIENTS_REJECTED', () => {
    expect(
      clients(initialState, {
        type: constants.FETCH_CLIENTS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the client: ERROR',
        records: []
      }
    );
  });

  it('should handle FETCH_CLIENTS_FULFILLED', () => {
    expect(
      clients(initialState, {
        type: constants.FETCH_CLIENTS_FULFILLED,
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
