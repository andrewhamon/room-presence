import { createStore, combineReducers, applyMiddleware } from 'redux'
import { receiver, beacon, measurement } from './reducers'

const rootReducer = combineReducers({
  receiver,
  beacon,
  measurement
})

const rootMiddleware = applyMiddleware()

export const store = createStore(rootReducer, rootMiddleware)
