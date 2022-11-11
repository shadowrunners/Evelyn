const { magenta, white, red } = require("chalk");

module.exports = {
  name: "nodeDisconnect",
  execute(node) {
    console.log(
      magenta("Lavalink") +
        white(" · ") +
        white("Lost connection to node ") +
        red(`${node.name}.`)
    );
  },
};
