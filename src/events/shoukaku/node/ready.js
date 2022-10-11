const { magenta, white, green } = require("chalk");
const { Node } = require("shoukaku");

module.exports = {
  name: "ready",
  /**
   * @param {Node} node
   */
  execute(node) {
    console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("]") +
        green(" Node ") +
        white(node.name) +
        green(" connected!")
    );
  },
};
