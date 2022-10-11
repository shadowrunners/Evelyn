const { magenta, white } = require("chalk");

module.exports = {
  name: "playerDestroy",
  execute() {
    console.log(
      magenta("[") +
        magenta("Shoukaku Player") +
        magenta("] ") +
        white(`Player destroyed.`)
    );
  },
};
