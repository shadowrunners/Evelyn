const { magenta, white, green } = require("chalk");

module.exports = {
  name: "nodeConnect",
  execute(node) {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("]") +
        green(" Node ") +
        white(node.options.id) +
        green(" connected!")
    );
  },
};
