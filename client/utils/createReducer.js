import Immutable, { Map, List } from 'immutable';

export default function createReducer(initialState, actionHandlers) {
  return (state = initialState, action) => {
    if (!Map.isMap(state) && !List.isList(state)) {
      state = Immutable.fromJS(state); // eslint-disable-line no-param-reassign
    }

    const handler = actionHandlers[action.type];
    if (!handler) {
      return state;
    }

    state = handler(state, action); // eslint-disable-line no-param-reassign
    if (!Map.isMap(state) && !List.isList(state)) {
      throw new TypeError('Reducers must return Immutable objects.');
    }

    return state;
  };
}
