import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import uuidv4 from 'uuid/v4'
import minimist from 'minimist'
import {hostname} from 'os'

const argv = minimist(process.argv.slice(2))
const home = process.env.HOME || process.cwd()

const configDir = String(argv['c'] || argv['config'] || path.join(home, '.config/room-presence'))

mkdirp.sync(configDir)

try {
  fs.statSync(path.join(configDir, 'machine-id'))
} catch (err) {
  console.log('Generating new machine id at ' + path.join(configDir, 'machine-id'))
  fs.writeFileSync(path.join(configDir, 'machine-id'), uuidv4())
}

const machineId = fs.readFileSync(path.join(configDir, 'machine-id'), 'utf8')

const defaultConfig = {
  name: hostname(),
  redisUrl: 'redis://127.0.0.1:6379',
  redisPrefix: ''
}

function configFromFile () {
  try {
    return JSON.parse(fs.readFileSync(path.join(configDir, 'config.json'), 'utf8'))
  } catch (err) {
    console.error('Could not read config at ' + path.join(configDir, 'config.json'))
    return {}
  }
}

const penultimateConfig = Object.assign({}, defaultConfig, configFromFile(), {machineId: machineId})

const computedConfig = {
  redischannel: penultimateConfig.redisPrefix + 'roomPresenceStream'
}

const config = Object.assign({}, penultimateConfig, computedConfig)

export default config
