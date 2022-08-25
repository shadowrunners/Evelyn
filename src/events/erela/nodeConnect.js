const client = require("../../structures/index.js");
const { magenta, white, green } = require("chalk");

module.exports = {
  name: "nodeConnect",
  run: client.manager.on("nodeConnect", (node) => {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("]") +
        green(" Node ") +
        white(node.options.id) +
        green(" connected!")
    );
  }),
};
