const { magenta, white } = require("chalk");

module.exports = {
  name: "playerDestroy",
  execute() {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        white(`Player destroyed.`)
    );
  },
};
