/* @flow */

const path   = require('path')
const fs     = require('fs')
const mkdirp = require('mkdirp')
const uuidv4 = require('uuid/v4')

const argv = require('minimist')(process.argv.slice(2))
const home = process.env.HOME || ""

const configDir: string = argv["c"] || argv["config"] || path.join(home, "config/room-presence/receiver")

mkdirp.sync(configDir)

try {
  const stats = fs.statSync(path.join(configDir, "machine-id"));
} catch(err) {
  console.log("Generating new machine id at " + path.join(configDir, "machine-id"))
  fs.writeFileSync(path.join(configDir, "machine-id"), uuidv4())
}

const machineId = fs.readFileSync(path.join(configDir, "machine-id"), 'utf8')

const defaultConfig = {
  name: "Room Presence Receiver",
  redis_url: "redis://127.0.0.1:6379",
  redis_prefix: "",
  redis_stream_key: "roomPresence"
}

var configFromFile = {}

try {
  const configStringFromFile = fs.readFileSync(path.join(configDir, "config.json"), "utf8")
  configFromFile = JSON.parse(configStringFromFile)
} catch(err) {
  console.log(err)
  configFromFile = {}
}


const config = Object.assign({}, defaultConfig, configFromFile, {machineId: machineId})

module.exports = config
