const client = require("../../structures/index.js");
const { magenta, white, red } = require("chalk");

module.exports = {
  name: "playerDestroy",
  run: client.manager.on("playerDestroy", () => {
    console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("] ") +
        white(`Player destroyed.`)
    );
  }),
};
