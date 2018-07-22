import { subscribe } from "../common/stream.js"
import { store } from "./store"

import config from "../common/config"

subscribe(config.redischannel, event => {
  if (event.type) {
    store.dispatch(event)
  }
})

store.subscribe(() => {
  // eslint-disable-next-line no-console
  console.log(store.getState())
})
