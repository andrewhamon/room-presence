import { createStore, combineReducers, applyMiddleware } from 'redux'
import { receiver, beacon } from './reducers'
import { destringifyAction } from '../common/middleware'

const rootReducer = combineReducers({
  receiver,
  beacon
})

const rootMiddleware = applyMiddleware(destringifyAction)

export const store = createStore(rootReducer, rootMiddleware)
