const client = require("../../structures/index.js");
const { magenta, white, red } = require("chalk");

module.exports = {
  name: "nodeDisconnect",
  run: client.manager.on("nodeDisconnect", (node) => {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        white(`Lost connection to node`) +
        red(` ${node.options.identifier}.`)
    );
  }),
};
