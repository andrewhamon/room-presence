import { BEACON_DISCOVERED } from './actions.js'

function destringifyObjectFactory (numericTypes) {
  return function (obj) {
    const newValues = {}

    Object.keys(obj).forEach((key) => {
      if (numericTypes.includes(key)) {
        newValues[key] = Number(obj[key])
      }
    })

    return Object.assign({}, obj, newValues)
  }
}

const destringifiers = {
  [BEACON_DISCOVERED]: destringifyObjectFactory(['rssi', 'accuracy', 'measuredPower'])
}

export const destringifyAction = store => next => action => {
  const destringifier = destringifiers[action.type]

  let result
  if (destringifier) {
    const newAction = destringifier(action)
    result = next(newAction)
  } else {
    result = next(action)
  }

  return result
}
