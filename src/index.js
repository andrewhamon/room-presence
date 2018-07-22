import minimist from "minimist"
const argv = minimist(process.argv.slice(2))

const command = argv["_"][0]

switch (command) {
  case "server":
    require("./server/index.js")
    break
  case "receiver":
    require("./receiver/index.js")
    break
  default:
    // eslint-disable-next-line no-console
    console.log("Please specify server or receiver")
}
