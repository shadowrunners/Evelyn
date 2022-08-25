const client = require("../../structures/index.js");
const { magenta, white, green } = require("chalk");

module.exports = {
  name: "nodeError",
  run: client.manager.on("nodeError", (node, error) => {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        red("An error has occured regarding node ") +
        white(node.options.identifier) +
        red(`: ${error.message}.`)
    );
  }),
};
