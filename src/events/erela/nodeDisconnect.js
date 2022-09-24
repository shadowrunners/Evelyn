const { magenta, white, red } = require("chalk");

module.exports = {
  name: "nodeDisconnect",
  execute(node) {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        white(`Lost connection to node`) +
        red(` ${node.options.identifier}.`)
    );
  },
};
