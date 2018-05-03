import config from '../common/config'
import bleacon from 'bleacon'
// import noble from "noble"
import {createClient} from 'redis'
import {publish} from '../common/stream'
import {BEACON_DISCOVERED} from '../common/actions'

const redisClient = createClient(config.redisUrl)

// const EXPECTED_MANUFACTURER_DATA_LENGTH = 25
// const APPLE_COMPANY_IDENTIFIER = 0x004c // https://www.bluetooth.org/en-us/specification/assigned-numbers/company-identifiers
// const IBEACON_TYPE = 0x02
// const EXPECTED_IBEACON_DATA_LENGTH = 0x15

// const onBluetoothStateChange(state: "unknown" | "resetting" | "unsupported" | "unauthorized" | "poweredOff" | "poweredOn")

async function onBeaconDiscovered (beacon: {uuid: string, rssi: number, measuredPower: number, accuracy: number, proximity: "unknown" | "immediate" | "near" | "far"}) {
  try {
    await publish(redisClient, config.redisStreamKey, Object.assign(beacon, {
      type: BEACON_DISCOVERED,
      machineId: config.machineId
    }))
  } catch (e) {
    console.error(e)
  }
}

bleacon.on('discover', onBeaconDiscovered)

bleacon.startScanning()
