const { magenta, white, red } = require("chalk");

module.exports = {
  name: "nodeError",
  execute(node, error) {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        red("An error has occured regarding node ") +
        white(node.options.identifier) +
        red(`: ${error.message}.`)
    );
  },
};
