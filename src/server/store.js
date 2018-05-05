import { createStore, combineReducers, applyMiddleware } from 'redux'
import { receiver, beacon } from './reducers'

const rootReducer = combineReducers({
  receiver,
  beacon
})

const rootMiddleware = applyMiddleware()

export const store = createStore(rootReducer, rootMiddleware)
