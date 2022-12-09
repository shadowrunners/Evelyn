const { magenta, white, red } = require("chalk");
const { Node } = require("shoukaku");

module.exports = {
  name: "disconnect",
  shoukaku: true,
  /**
   * @param {Node} node
   */
  execute(node, players, moved) {
    if (moved) return;
    players.map((player) => player.connection.disconnect());

    console.log(
      `${magenta("Lavalink")} ${white("·")} ${white(
        "Lost connection to node"
      )} ${red(`${node.name}.`)}`
    );
  },
};
