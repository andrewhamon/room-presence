import chunk from 'chunk'
import {promisify} from 'util'

function objectToArray (object: Object) {
  const result: Array<any> = []

  Object.keys(object).forEach((key) => {
    result.push(key)
    result.push(object[key])
  })

  return result
}

function arrayToObject (arr) {
  const obj = {}

  chunk(arr, 2).forEach((pair) => {
    obj[pair[0]] = pair[1]
  })

  return obj
}

function normalizeEvent (event) {
  const eventId = event[0]
  const normalizedEvent = arrayToObject(event[1])
  normalizedEvent['eventId'] = eventId

  return normalizedEvent
}

function normalizeEvents (reply) {
  return reply[0][1].map((event) => {
    return normalizeEvent(event)
  })
}

const checkForEvents = promisify((redisClient, streamKey, lastSeen, callback) => {
  redisClient.send_command('XREAD',
    [
      'BLOCK',
      5000,
      'COUNT',
      100,
      'STREAMS',
      streamKey,
      lastSeen
    ],
    callback
  )
})

export async function subscribe (redisClient, streamKey, callback) {
  var lastSeenId = '-'

  while (true) {
    try {
      const reply = await checkForEvents(redisClient, streamKey, lastSeenId)
      if (!reply) { continue }
      const events = normalizeEvents(reply)
      lastSeenId = events[events.length - 1].eventId
      events.forEach((event) => {
        callback(event)
      })
    } catch (err) {
      console.error(err)
    }
  }
}

export const publish = promisify(function (redisClient, streamKey, object, callback) {
  return redisClient.send_command(
    'XADD',
    [streamKey, '*'].concat(objectToArray(object)),
    (err, val) => { callback(err, val) }
  )
})
