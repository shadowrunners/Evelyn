const { magenta, white, red } = require("chalk");

module.exports = {
  name: "nodeError",
  execute(node, error) {
    console.log(
      magenta("Lavalink") +
        white(" · ") +
        red("An error has occured regarding node ") +
        white(node.name) +
        red(`: ${error.message}.`)
    );
  },
};
