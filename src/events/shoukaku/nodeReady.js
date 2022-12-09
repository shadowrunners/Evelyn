const { magenta, white, green } = require("chalk");
const { Node } = require("shoukaku");

module.exports = {
  name: "ready",
  shoukaku: true,
  /**
   * @param {Node} node
   */
  execute(node) {
    console.log(
      `${magenta("Lavalink")} ${white("·")} ${green(`Node`)} ${white(
        `${node.name}`
      )} ${green(`connected!`)}`
    );
  },
};
