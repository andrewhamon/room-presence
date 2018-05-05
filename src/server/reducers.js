import {BEACON_DISCOVERED, RECEIVER_PING} from '../common/actions'

const mergeReceiversDiscovered = (oldReceiver = {}, action) => {
  const newReceiver = {
    lastSeenAt: action.receivedAt
  }

  return Object.assign({}, oldReceiver, newReceiver)
}

const mergeReceiversPing = (oldReceiver = {}, action) => {
  const newReceiver = {
    lastSeenAt: action.receivedAt,
    name: action.name
  }

  return Object.assign({}, oldReceiver, newReceiver)
}

export const receiver = (previousState: Object = {}, action: Object) => {
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

const mergeBeacons = (oldBeacon = {}, action) => {
  const newBeacon = {
    measuredPower: action.measuredPower,
    lastSeenAt: action.receivedAt
  }

  return Object.assign({}, oldBeacon, newBeacon)
}

export const beacon = (previousState: Object = {}, action: Object) => {
  switch (action.type) {
    case BEACON_DISCOVERED:
      previousState[action.uuid] = mergeBeacons(previousState[action.uuid], action)
      return previousState
    default:
      return previousState
  }
}
