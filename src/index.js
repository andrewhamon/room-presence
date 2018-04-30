/* @flow */

var Bleacon = require('bleacon');

function onBeaconDiscovered(beacon: {uuid: string, rssi: number, measuredPower: number, accuracy: number, proximity: "unknown" | "immediate" | "near" | "far"}){
  console.log(beacon.uuid + " " + beacon.rssi)
}

Bleacon.on('discover', onBeaconDiscovered)

Bleacon.startScanning()
