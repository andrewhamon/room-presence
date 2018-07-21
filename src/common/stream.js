import redis from "redis"
import { promisify } from "util"

import config from "./config"

const redisSubClient = redis.createClient(config.redisUrl)
const redisPubClient = redis.createClient(config.redisUrl)

const subscriptions = {}

function isHashObject(val) {
  return !!val && !Array.isArray(val) && val.constructor == Object
}

redisSubClient.on("message", (channel, message) => {
  const subscribers = subscriptions[channel] || []

  try {
    const parsedMessage = JSON.parse(message)

    if (isHashObject(parsedMessage)) {
      parsedMessage.receivedAt = Date.now()

      subscribers.forEach(subscriber => {
        subscriber(parsedMessage)
      })
    } else {
      console.error("Received non-object json from channel", channel)
    }
  } catch (err) {
    console.error("Error parsing message as json from channel", channel)
  }
})

export function subscribe(channel, callback) {
  subscriptions[channel] = subscriptions[channel] || []
  subscriptions[channel].push(callback)

  redisSubClient.subscribe(channel, (err, reply) => {
    if (err) {
      console.error("Error subscribing to ", channel)
      console.error(err)
    }
  })
}

export const publish = promisify(function(channel, object, callback) {
  return redisPubClient.publish(channel, JSON.stringify(object), callback)
})
