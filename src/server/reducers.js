import {BEACON_DISCOVERED} from '../common/actions'

const mergeReceivers = (oldReceiver = {}, action) => {
  const newReceiver = {
    lastSeenEvent: action.eventId
  }

  return Object.assign({}, oldReceiver, newReceiver)
}

export const receiver = (previousState: Object = {}, action: Object) => {
  switch (action.type) {
    case BEACON_DISCOVERED:
      previousState[action.machineId] = mergeReceivers(previousState[action.machineId], action)
      return previousState
    default:
      return previousState
  }
}

const mergeBeacons = (oldBeacon = {}, action) => {
  const newBeacon = {
    measuredPower: action.measuredPower,
    lastSeenEvent: action.eventId
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
