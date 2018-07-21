import {BEACON_DISCOVERED, RECEIVER_PING} from '../common/actions'

function mergeReceiversDiscovered (oldReceiver = {}, action) {
  const newReceiver = {
    lastSeenAt: action.receivedAt
  }

  return Object.assign({}, oldReceiver, newReceiver)
}

function mergeReceiversPing (oldReceiver = {}, action) {
  const newReceiver = {
    lastSeenAt: action.receivedAt,
    name: action.name
  }

  return Object.assign({}, oldReceiver, newReceiver)
}

export function receiver (previousState = {}, action) {
  switch (action.type) {
    case BEACON_DISCOVERED:
      previousState[action.machineId] = mergeReceiversDiscovered(previousState[action.machineId], action)
      return previousState
    case RECEIVER_PING:
      previousState[action.machineId] = mergeReceiversPing(previousState[action.machineId], action)
      return previousState
    default:
      return previousState
  }
}

function mergeBeacons (oldBeacon = {}, action) {
  const newBeacon = {
    measuredPower: action.measuredPower,
    lastSeenAt: action.receivedAt
  }

  return Object.assign({}, oldBeacon, newBeacon)
}

export function beacon (previousState = {}, action) {
  switch (action.type) {
    case BEACON_DISCOVERED:
      previousState[action.uuid] = mergeBeacons(previousState[action.uuid], action)
      return previousState
    default:
      return previousState
  }
}

const MAX_MEASUREMENT_TIME = 10000

export function measurement (previousState = [], action) {
  switch (action.type) {
    case BEACON_DISCOVERED:
      previousState.unshift({
        beacon_id: action.uuid,
        receiver_id: action.machineId,
        rssi: action.rssi,
        seenAt: action.receivedAt
      })

      while (previousState[previousState.length - 1] && previousState[previousState.length - 1].seenAt < (action.receivedAt - MAX_MEASUREMENT_TIME)) {
        previousState.pop()
      }
      return previousState
    default:
      return previousState
  }
}
