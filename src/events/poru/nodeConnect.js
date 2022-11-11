const { magenta, white, green } = require("chalk");

module.exports = {
  name: "nodeConnect",
  execute(node) {
    console.log(
      magenta("Lavalink") +
        white(" · ") +
        green("Node ") +
        white(node.name) +
        green(" connected!")
    );
  },
};
