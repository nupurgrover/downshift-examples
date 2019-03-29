import {combineReducers} from 'redux'
import starWarsNames from 'starwars-names'
import {ADD_ITEM, REMOVE_ITEM} from './actions'

const items = starWarsNames.all.map(s => ({name: s, id: s.toLowerCase()}))
const initialState = {
  items,
  selectedItem: null,
}

export const select = createReducer(initialState, {
  [ADD_ITEM]: (state, {item}) => {
    return Object.assign({}, state, {selectedItem: item})
  },
  [REMOVE_ITEM]: (state, {item}) => {
    return Object.assign({}, state, {selectedItem: item})
  },
})

export default combineReducers({
  select,
})

// making using reducers a bit nicer
function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    const handler = action && action.type ? handlers[action.type] : undefined

    if (!handler) {
      return state
    }

    return handler(state, action)
  }
}
