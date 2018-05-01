/* @flow */

const fs = require("fs")
const bleacon = require("bleacon")
const config = require("./config")
const redis = require("redis").createClient(config.redis_url)

const streamKey = config.redis_prefix + config.redis_stream_key

var lastIdSent = ""

function onBeaconDiscovered(beacon: {uuid: string, rssi: number, measuredPower: number, accuracy: number, proximity: "unknown" | "immediate" | "near" | "far"}){
  redis.send_command("XADD",
    [streamKey, "*",
      "machine_id", config.machineId,
      "beacon_uuid", beacon.uuid,
      "beacon_rssi", beacon.rssi,
      "beacon_meadured_power", beacon.measuredPower,
      "beacon_accuracy", beacon.accuracy,
      "beacon_proximity", beacon.proximity
    ],
    (err, reply) => {
      if(err){
        console.log(err)
      } else {
        lastIdSent = reply
      }
    }
  )

  console.log(lastIdSent)
}

bleacon.on('discover', onBeaconDiscovered)

bleacon.startScanning()
