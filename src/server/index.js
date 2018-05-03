import {subscribe} from '../common/stream.js'
import {store} from './store'

import config from '../common/config'
import redis from 'redis'

const redisClient = redis.createClient(config.redisUrl)

subscribe(redisClient, config.redisStreamKey, (event) => {
  if (event.type) {
    store.dispatch(event)
  }
})

store.subscribe(() => {
  console.log(store.getState())
})
